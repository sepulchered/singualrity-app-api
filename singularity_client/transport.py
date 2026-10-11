"""Low-level HTTP transport for the Singularity REST API.

:class:`Transport` wraps the dependency-free HTTP layer in
:mod:`singularity_client._http` (built on ``urllib.request`` only) and adds
everything the API requires/returns consistently:

* Bearer authentication (``Authorization: Bearer <rest-token>``).
* JSON encoding/decoding with tolerant empty-body handling.
* Query-parameter normalization (bools to ``true``/``false``, enums to values,
  dates to ISO strings, ``None`` dropped).
* Optional retries with exponential backoff on 429/5xx and network errors.
* Mapping of non-2xx responses to the typed exceptions in
  :mod:`singularity_client.exceptions`.

Agents should normally interact with :class:`singularity_client.client.SingularityClient`
rather than this module directly.
"""

from __future__ import annotations

import datetime as _dt
import logging
import time
from enum import Enum
from typing import Any, Dict, Iterable, Mapping, Optional, Union

from ._http import HTTPError, Response, Session, json_dumps
from .exceptions import (
    SingularityConfigurationError,
    SingularityConnectionError,
    error_from_response,
)

logger = logging.getLogger("singularity_client")

DEFAULT_BASE_URL = "https://api.singularity-app.com"
#: Endpoints that are retried automatically when ``max_retries > 0``.
RETRYABLE_STATUS = frozenset({429, 500, 502, 503, 504})


def normalize_params(params: Optional[Mapping[str, Any]]) -> Optional[Dict[str, Any]]:
    """Convert a user-supplied params mapping into wire-friendly scalars.

    * ``None`` values are dropped.
    * Booleans become ``"true"`` / ``"false"`` (the API is strict about it).
    * Enum members become their ``value``.
    * ``date``/``datetime`` become ISO strings.
    * Lists/tuples are joined with commas (used by ``*.in`` filters and ``tags``).
    """
    if not params:
        return None
    out: Dict[str, Any] = {}
    for key, value in params.items():
        if value is None:
            continue
        out[key] = _param_value(value)
    return out or None


def _param_value(value: Any) -> Any:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, Enum):
        return _param_value(value.value)
    if isinstance(value, _dt.datetime):
        from .filters import to_iso_utc

        return to_iso_utc(value)
    if isinstance(value, _dt.date):
        return value.isoformat()
    if isinstance(value, (list, tuple, set)):
        return ",".join(str(_param_value(v)) for v in value)
    return value


class Transport:
    """Thin, well-behaved HTTP client used by all resource classes.

    Parameters
    ----------
    token:
        The Singularity **REST token** (Bearer).  Obtain it in the app under
        *Settings → Integrations → REST API*.  May be ``None`` only for tests
        or unauthenticated probes -- real endpoints will answer 401.
    base_url:
        Defaults to ``https://api.singularity-app.com``.
    timeout:
        Per-request timeout in seconds (connect+read), default 30.
    max_retries:
        Number of automatic retries for 429/5xx responses and connection
        errors.  Retry delay honours the ``Retry-After`` header when present,
        otherwise uses capped exponential backoff.  Default 2.
    session:
        Bring your own :class:`singularity_client._http.Session` (custom TLS
        context, default headers...).  A plain ``requests.Session``-like object
        exposing ``request()``/``headers`` also works.
    user_agent:
        Sent as ``User-Agent`` header; useful for server-side debugging.
    """

    def __init__(
        self,
        token: Optional[str],
        base_url: str = DEFAULT_BASE_URL,
        *,
        timeout: float = 30.0,
        max_retries: int = 2,
        backoff_factor: float = 0.5,
        session: Optional[Session] = None,
        user_agent: str = "singularity-client/0.1 (+https://github.com/)",
    ) -> None:
        if base_url and not base_url.startswith(("http://", "https://")):
            raise SingularityConfigurationError(f"Invalid base_url: {base_url!r}")
        self.token = token
        self.base_url = (base_url or DEFAULT_BASE_URL).rstrip("/")
        self.timeout = timeout
        self.max_retries = max(0, int(max_retries))
        self.backoff_factor = backoff_factor
        self.session = session or Session()
        self.session.headers.setdefault("Accept", "application/json")
        self.session.headers.setdefault("User-Agent", user_agent)

    # ------------------------------------------------------------------ #
    # core request
    # ------------------------------------------------------------------ #

    def request(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Mapping[str, Any]] = None,
        json_body: Optional[Any] = None,
        extra_headers: Optional[Mapping[str, str]] = None,
    ) -> Any:
        """Perform an HTTP request and return decoded JSON (or ``None`` for 204).

        Raises
        ------
        singularity_client.exceptions.SingularityAPIError
            Subclass matching the HTTP status (see :mod:`singularity_client.exceptions`).
        singularity_client.exceptions.SingularityConnectionError
            Network failure after exhausting retries.
        """
        url = path if path.startswith("http") else f"{self.base_url}{path}"
        headers = dict(extra_headers or {})
        if self.token:
            headers.setdefault("Authorization", f"Bearer {self.token}")
        query = normalize_params(params)
        body: Optional[str] = None
        if json_body is not None:
            body = json_dumps(json_body)
            headers.setdefault("Content-Type", "application/json")

        attempts = self.max_retries + 1
        last_exc: Optional[Exception] = None
        for attempt in range(attempts):
            try:
                response = self.session.request(
                    method.upper(),
                    url,
                    params=query,
                    data=body,
                    headers=headers,
                    timeout=self.timeout,
                )
            except HTTPError as exc:  # DNS/timeout/TLS/etc.
                last_exc = exc
                logger.warning("Transport error on %s %s (attempt %d/%d): %s",
                               method, url, attempt + 1, attempts, exc)
                if attempt + 1 < attempts:
                    self._sleep(self.backoff_factor * (2 ** attempt))
                    continue
                raise SingularityConnectionError(
                    f"Network error calling {method.upper()} {url}: {exc}"
                ) from exc

            if response.status_code in RETRYABLE_STATUS and attempt + 1 < attempts:
                delay = self._retry_delay(response, attempt)
                logger.info("HTTP %s on %s %s -- retrying in %.2fs",
                            response.status_code, method, url, delay)
                self._sleep(delay)
                continue

            return self._handle(response, method, url)

        # Should not normally reach here; defensive re-raise.
        raise SingularityConnectionError(f"Failed to call {method.upper()} {url}: {last_exc}")

    @staticmethod
    def _sleep(seconds: float) -> None:
        time.sleep(min(max(seconds, 0.0), 60.0))

    def _retry_delay(self, response: Response, attempt: int) -> float:
        retry_after = response.headers.get("Retry-After")
        if retry_after:
            try:
                return min(float(retry_after), 60.0)
            except ValueError:
                pass
        return self.backoff_factor * (2 ** attempt)

    def _handle(self, response: Response, method: str, url: str) -> Any:
        if 200 <= response.status_code < 300:
            if response.status_code == 204 or not response.content:
                return None
            try:
                return response.json()
            except ValueError as exc:
                raise error_from_response(response) from exc
        error = error_from_response(response)
        error.method = method.upper()
        error.url = url
        raise error

    # ------------------------------------------------------------------ #
    # verb helpers
    # ------------------------------------------------------------------ #

    def get(self, path: str, params: Optional[Mapping[str, Any]] = None) -> Any:
        return self.request("GET", path, params=params)

    def post(self, path: str, json_body: Optional[Any] = None,
             params: Optional[Mapping[str, Any]] = None) -> Any:
        return self.request("POST", path, params=params, json_body=json_body)

    def patch(self, path: str, json_body: Optional[Any] = None) -> Any:
        return self.request("PATCH", path, json_body=json_body)

    def delete(self, path: str, params: Optional[Mapping[str, Any]] = None) -> Any:
        return self.request("DELETE", path, params=params)

    def close(self) -> None:
        self.session.close()

    def __enter__(self) -> "Transport":
        return self

    def __exit__(self, *exc_info: Iterable) -> None:
        self.close()
