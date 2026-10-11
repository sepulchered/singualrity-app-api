"""Tests for the stdlib-only HTTP layer in ``singularity_client._http``."""

from __future__ import annotations

import gzip
import json

import pytest

from singularity_client._http import HTTPError, Response, Session, json_dumps


def make_response(status=200, body=b"{}", headers=None, url="http://x/y"):
    from email.message import Message

    msg = Message()
    msg["Content-Type"] = "application/json; charset=utf-8"
    for k, v in (headers or {}).items():
        msg[k] = v
    return Response(status, msg, body, url)


class TestResponse:
    def test_json_roundtrip(self):
        r = make_response(body=json.dumps({"a": 1}).encode())
        assert r.json() == {"a": 1}
        assert r.ok is True
        assert r.status_code == 200

    def test_json_invalid_raises_value_error(self):
        r = make_response(body=b"<html>nope</html>")
        with pytest.raises(ValueError):
            r.json()

    def test_empty_body_json_raises(self):
        with pytest.raises(ValueError):
            make_response(body=b"").json()

    def test_text_uses_charset(self):
        from email.message import Message

        msg = Message()
        msg["Content-Type"] = "text/plain; charset=latin-1"
        r = Response(200, msg, "café".encode("latin-1"), "http://x")
        assert r.text == "café"

    def test_ok_property_bounds(self):
        assert make_response(status=299).ok
        assert not make_response(status=300).ok
        assert not make_response(status=404).ok


class TestSessionAgainstRealServer:
    def test_get_json_and_headers(self, api):
        api.stub("GET", "/v2/ping", json_body={"pong": True})
        session = Session(headers={"Accept": "application/json"})
        resp = session.request("GET", api.base_url + "/v2/ping", timeout=5)
        assert resp.status_code == 200
        assert resp.json() == {"pong": True}

    def test_query_params_encoding(self, api):
        session = Session()
        session.request("GET", api.base_url + "/v2/x",
                        params={"a": 1, "b": "two words", "c": None}, timeout=5)
        rec = api.last_request()
        assert "a=1" in rec["query"]
        assert "b=two+words" in rec["query"] or "b=two%20words" in rec["query"]
        assert "c=" not in rec["query"]  # None dropped

    def test_post_body_and_custom_headers(self, api):
        session = Session(headers={"User-Agent": "test/1"})
        session.request("POST", api.base_url + "/v2/task",
                        data=json_dumps({"title": "T"}),
                        headers={"Content-Type": "application/json",
                                 "Authorization": "Bearer abc"}, timeout=5)
        rec = api.last_request()
        assert rec["method"] == "POST"
        assert rec["json"] == {"title": "T"}
        assert rec["headers"]["authorization"] == "Bearer abc"
        assert rec["headers"]["user-agent"] == "test/1"

    def test_per_request_header_overrides_session_default(self, api):
        session = Session(headers={"X-Test": "session"})
        session.request("GET", api.base_url + "/v2/x",
                        headers={"X-Test": "request"}, timeout=5)
        assert api.last_request()["headers"]["x-test"] == "request"

    def test_non_2xx_returned_not_raised(self, api):
        api.stub("GET", "/v2/gone", status=404, json_body={"message": "nope"})
        session = Session()
        resp = session.request("GET", api.base_url + "/v2/gone", timeout=5)
        assert resp.status_code == 404
        assert resp.json()["message"] == "nope"

    def test_gzip_body_transparently_decompressed(self, api):
        payload = gzip.compress(json.dumps({"zipped": True}).encode())
        api.stub("GET", "/v2/zip", raw_body=payload,
                 headers={"Content-Encoding": "gzip"})
        session = Session()
        resp = session.request("GET", api.base_url + "/v2/zip", timeout=5)
        assert resp.json() == {"zipped": True}

    def test_connection_refused_raises_httperror(self):
        session = Session()
        # port 1 on localhost: nothing listening
        with pytest.raises(HTTPError):
            session.request("GET", "http://127.0.0.1:1/nope", timeout=2)

    def test_timeout_raises_httperror(self, api):
        import time

        class Slow:
            pass

        session = Session()
        with pytest.raises(HTTPError):
            # unroutable address -> connect timeout
            session.request("GET", "http://10.255.255.1/", timeout=0.5)
