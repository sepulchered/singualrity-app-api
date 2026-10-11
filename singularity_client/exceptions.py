"""Typed exception hierarchy for the Singularity API client.

Every error raised by this library is a subclass of :class:`SingularityError`,
so agents and applications can catch a single base class::

    try:
        client.tasks.list()
    except AuthenticationError:
        ...  # bad / expired REST token (HTTP 401/403)
    except NotFoundError:
        ...  # entity does not exist (HTTP 404)
    except BadRequestError:
        ...  # request rejected by server-side validation (HTTP 400/422)
    except RateLimitError as e:
        ...  # too many requests (HTTP 429) - retry after ``e.retry_after``
    except SingularityAPIError as e:
        ...  # any other non-2xx response
    except SingularityConnectionError:
        ...  # network failure (DNS, TLS, timeout)

Attributes carried by API errors are designed to be machine-readable:

* ``status_code`` -- HTTP status code (int) or ``None`` for transport errors.
* ``payload``     -- decoded JSON body of the error response (dict/list) if any.
* ``detail``      -- best-effort human/server error message string.
* ``retry_after`` -- parsed ``Retry-After`` header value in seconds (RateLimit only).
"""

from __future__ import annotations

from typing import Any, Optional


class SingularityError(Exception):
    """Base class for all errors raised by ``singularity_client``."""


class SingularityConfigurationError(SingularityError):
    """Raised when the client is mis-configured (missing token, bad base URL...)."""


class SingularityConnectionError(SingularityError):
    """Raised when the HTTP transport itself failed (timeout, DNS, TLS)."""


class SingularityAPIError(SingularityError):
    """Raised for any non-successful HTTP response from the API.

    Parameters
    ----------
    message:
        Human readable summary.
    status_code:
        HTTP status code returned by the server.
    payload:
        Decoded JSON body of the response when available (otherwise raw text
        is kept in :attr:`text`).
    text:
        Raw response body when it was not valid JSON.
    method / url:
        The request that produced the error (useful for logs/agents).
    """

    def __init__(
        self,
        message: str,
        *,
        status_code: Optional[int] = None,
        payload: Any = None,
        text: Optional[str] = None,
        method: Optional[str] = None,
        url: Optional[str] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.payload = payload
        self.text = text
        self.method = method
        self.url = url
        self.detail = _extract_detail(payload, text) or message
        # Append the server-provided detail so `str(exc)` is immediately
        # actionable for humans *and* agents (e.g. "... | Task not found").
        if self.detail and self.detail != message:
            self.message = f"{message} | {self.detail}"

    def __str__(self) -> str:  # pragma: no cover - trivial
        bits = [self.message]
        if self.status_code is not None:
            bits.append(f"status={self.status_code}")
        if self.method and self.url:
            bits.append(f"{self.method} {self.url}")
        return " | ".join(bits)


def _extract_detail(payload: Any, text: Optional[str]) -> Optional[str]:
    """Best effort extraction of a server error message from a JSON payload."""
    if isinstance(payload, dict):
        for key in ("message", "error", "description", "detail", "reason"):
            value = payload.get(key)
            if isinstance(value, str) and value:
                return value
            if isinstance(value, dict):  # nested {"error": {"message": ...}}
                inner = value.get("message") or value.get("error")
                if isinstance(inner, str) and inner:
                    return inner
    if isinstance(text, str) and text.strip():
        return text.strip()[:500]
    return None


class BadRequestError(SingularityAPIError):
    """HTTP 400/422 -- request failed server-side validation."""


class AuthenticationError(SingularityAPIError):
    """HTTP 401/403 -- the REST token is missing, invalid or expired."""


class NotFoundError(SingularityAPIError):
    """HTTP 404 -- the requested entity (or endpoint) does not exist."""


class ConflictError(SingularityAPIError):
    """HTTP 409 -- state conflict (e.g. illegal transition)."""


class RateLimitError(SingularityAPIError):
    """HTTP 429 -- rate limited.

    ``retry_after`` holds the parsed ``Retry-After`` header in seconds
    (defaults to ``None`` when the server did not send one).
    """

    def __init__(self, *args: Any, retry_after: Optional[float] = None, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.retry_after = retry_after


class ServerError(SingularityAPIError):
    """HTTP 5xx -- the server failed; safe to retry with backoff."""


STATUS_EXCEPTION_MAP = {
    400: BadRequestError,
    401: AuthenticationError,
    403: AuthenticationError,
    404: NotFoundError,
    409: ConflictError,
    422: BadRequestError,
    429: RateLimitError,
}


def error_from_response(response: Any) -> SingularityAPIError:
    """Build the most specific exception type for an HTTP *response*.

    ``response`` is any object exposing ``status_code``, ``text``,
    ``headers`` and ``json()``
    (i.e. :class:`singularity_client._http.Response`).
    """
    status = int(response.status_code)
    try:
        payload = response.json()
    except Exception:  # noqa: BLE001 - body may not be JSON
        payload = None
    text = response.text if payload is None else None

    message = f"Singularity API returned HTTP {status}"
    kwargs: dict = dict(status_code=status, payload=payload, text=text)

    cls = STATUS_EXCEPTION_MAP.get(status)
    if cls is None:
        cls = ServerError if status >= 500 else SingularityAPIError
    if cls is RateLimitError:
        retry_after = response.headers.get("Retry-After")
        seconds: Optional[float] = None
        if retry_after:
            try:
                seconds = float(retry_after)
            except ValueError:
                seconds = None
        kwargs["retry_after"] = seconds
    return cls(message, **kwargs)
