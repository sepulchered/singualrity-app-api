"""Transport-level tests: auth headers, param normalization, retries, error mapping."""

from __future__ import annotations

import datetime as dt

import pytest

from singularity_client import SingularityClient
from singularity_client.exceptions import (
    AuthenticationError,
    BadRequestError,
    ConflictError,
    NotFoundError,
    RateLimitError,
    ServerError,
    SingularityAPIError,
    SingularityConfigurationError,
    SingularityConnectionError,
)
from singularity_client.transport import Transport, normalize_params


class TestNormalizeParams:
    def test_bools_to_lowercase_strings(self):
        assert normalize_params({"a": True, "b": False}) == {"a": "true", "b": "false"}

    def test_none_dropped_and_empty_becomes_none(self):
        assert normalize_params({"x": None}) is None
        assert normalize_params(None) is None

    def test_enum_to_value(self):
        from singularity_client import Priority

        assert normalize_params({"priority": Priority.HIGH}) == {"priority": 0}

    def test_dates_to_iso(self):
        out = normalize_params({"d": dt.date(2026, 7, 1),
                                "t": dt.datetime(2026, 7, 1, 12, 0, tzinfo=dt.timezone.utc)})
        assert out["d"] == "2026-07-01"
        assert out["t"].startswith("2026-07-01T12:00:00")

    def test_sequences_comma_joined(self):
        assert normalize_params({"ids": ["P-1", "P-2"]}) == {"ids": "P-1,P-2"}


class TestAuthAndHeaders:
    def test_bearer_header_sent(self, client, api):
        client.projects.list()
        rec = api.last_request()
        assert rec["headers"]["authorization"] == "Bearer test-token"
        assert rec["headers"]["accept"] == "application/json"
        assert rec["headers"]["user-agent"].startswith("singularity-client/")

    def test_json_content_type_on_write(self, client, api):
        client.tasks.create("X", projectId="P-1")
        rec = api.last_request()
        assert rec["headers"]["content-type"] == "application/json"
        assert rec["json"] == {"title": "X", "projectId": "P-1"}

    def test_no_token_no_auth_header(self, api):
        c = SingularityClient(token=None, base_url=api.base_url, allow_no_token=True)
        c.projects.list()
        assert "authorization" not in api.last_request()["headers"]
        c.close()


class TestErrorMapping:
    @pytest.mark.parametrize("status,exc", [
        (400, BadRequestError), (401, AuthenticationError), (403, AuthenticationError),
        (404, NotFoundError), (409, ConflictError), (422, BadRequestError),
        (429, RateLimitError), (500, ServerError), (503, ServerError),
    ])
    def test_status_to_exception(self, api, status, exc):
        api.stub("GET", "/v2/project", status=status,
                 json_body={"message": f"boom {status}"})
        c = SingularityClient(token="t", base_url=api.base_url, max_retries=0)
        with pytest.raises(exc) as ei:
            c.projects.list()
        err = ei.value
        assert err.status_code == status
        assert err.detail == f"boom {status}"
        assert err.method == "GET" and err.url.endswith("/v2/project")
        c.close()

    def test_rate_limit_retry_after_parsed(self, api):
        api.stub("GET", "/v2/task", status=429, headers={"Retry-After": "7"},
                 json_body={"message": "slow down"})
        c = SingularityClient(token="t", base_url=api.base_url, max_retries=0)
        with pytest.raises(RateLimitError) as ei:
            c.tasks.list()
        assert ei.value.retry_after == 7.0
        c.close()

    def test_non_json_error_body_kept_as_text(self, api):
        api.stub("GET", "/v2/tag", status=502, raw_body="<html>bad gateway</html>")
        c = SingularityClient(token="t", base_url=api.base_url, max_retries=0)
        with pytest.raises(ServerError) as ei:
            c.tags.list()
        assert "bad gateway" in ei.value.text
        c.close()

    def test_unknown_4xx_maps_to_base_api_error(self, api):
        api.stub("GET", "/v2/habit", status=418, json_body={})
        c = SingularityClient(token="t", base_url=api.base_url, max_retries=0)
        with pytest.raises(SingularityAPIError) as ei:
            c.habits.list()
        assert type(ei.value) is SingularityAPIError
        c.close()


class TestRetries:
    def test_retries_on_500_then_success(self, api):
        api.stub("GET", "/v2/project", status=500, json_body={}, repeat=2)
        api.stub("GET", "/v2/project", status=200, json_body={"projects": []})
        c = SingularityClient(token="t", base_url=api.base_url,
                              max_retries=2, backoff_factor=0.01)
        result = c.projects.list()   # should succeed after two failures
        assert len(result) == 0
        assert len(api.requests) == 3
        c.close()

    def test_retry_exhausted_raises(self, api):
        api.stub("GET", "/v2/project", status=503, json_body={}, repeat=5)
        c = SingularityClient(token="t", base_url=api.base_url,
                              max_retries=1, backoff_factor=0.01)
        with pytest.raises(ServerError):
            c.projects.list()
        assert len(api.requests) == 2      # initial + one retry
        c.close()

    def test_connection_error_after_retries(self):
        c = SingularityClient(token="t", base_url="http://127.0.0.1:1",
                              timeout=2, max_retries=1, backoff_factor=0.01)
        with pytest.raises(SingularityConnectionError):
            c.projects.list()
        c.close()

    def test_backoff_honours_retry_after(self, api, monkeypatch):
        slept = []
        monkeypatch.setattr(Transport, "_sleep", staticmethod(lambda s: slept.append(s)))
        api.stub("GET", "/v2/project", status=429, headers={"Retry-After": "3"},
                 json_body={}, repeat=1)
        api.stub("GET", "/v2/project", status=200, json_body={"projects": []})
        c = SingularityClient(token="t", base_url=api.base_url,
                              max_retries=1, backoff_factor=0.5)
        c.projects.list()
        assert slept == [3.0]
        c.close()


class TestConfiguration:
    def test_missing_token_raises(self, monkeypatch):
        monkeypatch.delenv("SINGULARITY_TOKEN", raising=False)
        with pytest.raises(SingularityConfigurationError):
            SingularityClient()

    def test_env_token_used(self, monkeypatch, api):
        monkeypatch.setenv("SINGULARITY_TOKEN", "from-env")
        c = SingularityClient(base_url=api.base_url)
        c.projects.list()
        assert api.last_request()["headers"]["authorization"] == "Bearer from-env"
        c.close()

    def test_bad_base_url_raises(self):
        with pytest.raises(SingularityConfigurationError):
            SingularityClient(token="t", base_url="ftp://nope")

    def test_empty_list_response_yields_empty_entitylist(self, client, api):
        api.stub("GET", "/v2/project", json_body={})
        result = client.projects.list()
        assert len(result) == 0 and result.items == []


class TestRawEscapeHatch:
    def test_raw_returns_decoded_json(self, client, api):
        api.stub("POST", "/v2/tag", status=201, json_body={"id": "A-1", "title": "x"})
        data = client.raw("POST", "/v2/tag", json_body={"title": "x"})
        assert data == {"id": "A-1", "title": "x"}
        assert api.last_request()["json"] == {"title": "x"}

    def test_raw_get_with_params(self, client, api):
        api.stub("GET", "/v2/task", json_body={"tasks": []})
        client.raw("GET", "/v2/task", params={"maxCount": 10, "includeArchived": True})
        q = api.last_request()["query"]
        assert "maxCount=10" in q and "includeArchived=true" in q
