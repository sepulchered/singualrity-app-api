"""Minimal HTTP layer built exclusively on the Python standard library.

This module is a tiny, dependency-free substitute for the parts of
``requests`` that ``singularity_client`` needs.  It is implemented on top of
:mod:`urllib.request` and exposes a *requests-like* API so the transport code
stays readable:

* :class:`Response` -- ``status_code``, ``headers``, ``text``, ``content`` and
  ``json()`` just like ``requests.Response``.
* :class:`Session` -- persistent headers plus a single ``request()`` entry
  point with timeout support and redirect following.

The library has **no third-party runtime dependencies**; everything here uses
only the standard library (``urllib``, ``json``, ``gzip``, ``io``, ``email``).
"""

from __future__ import annotations

import gzip
import http.client
import io
import json as _json
import ssl
import urllib.error
import urllib.parse
import urllib.request
from email.message import Message
from typing import Any, Dict, Mapping, Optional, Union


class HTTPError(Exception):
    """Raised when an HTTP request fails at the transport level.

    Mirrors ``requests.RequestException``: the transport layer catches this
    class to decide whether a request may be retried.  ``URLError`` (DNS
    failures, timeouts, TLS problems) and ``BadStatusLine`` style errors are
    all normalized into this single exception type.
    """


class Response:
    """A lightweight, requests-compatible HTTP response object.

    Attributes
    ----------
    status_code:
        Integer HTTP status code (e.g. ``200``, ``404``).
    headers:
        Case-insensitive mapping of response headers (a stdlib
        :class:`email.message.Message`).
    content:
        Raw response body as :class:`bytes` (already transparently gunzipped
        when the server used ``Content-Encoding: gzip``).
    url:
        Final URL the response came from (after redirects).
    reason:
        HTTP reason phrase (``"OK"``, ``"Not Found"`` ...).
    """

    def __init__(
        self,
        status_code: int,
        headers: Message,
        content: bytes,
        url: str,
        reason: str = "",
    ) -> None:
        self.status_code = int(status_code)
        self.headers = headers
        self.content = content
        self.url = url
        self.reason = reason

    # ------------------------------------------------------------------ #
    # convenience accessors (requests parity)
    # ------------------------------------------------------------------ #

    @property
    def ok(self) -> bool:
        """``True`` when the status code is in the 2xx range."""
        return 200 <= self.status_code < 300

    @property
    def text(self) -> str:
        """Decoded body using the charset advertised by the server (UTF-8 fallback)."""
        charset = self._charset() or "utf-8"
        try:
            return self.content.decode(charset, errors="replace")
        except LookupError:  # pragma: no cover - exotic/invalid charset
            return self.content.decode("utf-8", errors="replace")

    def json(self) -> Any:
        """Decode the body as JSON.

        Raises
        ------
        ValueError
            When the body is not valid JSON -- same contract as
            ``requests.Response.json()`` so callers can catch ``ValueError``.
        """
        if not self.content:
            raise ValueError("Response body is empty; cannot decode JSON")
        try:
            return _json.loads(self.text)
        except _json.JSONDecodeError as exc:  # py3.8+: JSONDecodeError ⊂ ValueError
            raise ValueError(str(exc)) from None

    def _charset(self) -> Optional[str]:
        ctype = self.headers.get("Content-Type", "") if self.headers else ""
        params: Dict[str, str] = {}
        for part in ctype.split(";")[1:]:
            key, _, value = part.partition("=")
            params[key.strip().lower()] = value.strip().strip('"')
        return params.get("charset")

    def __repr__(self) -> str:  # pragma: no cover - debugging aid
        return f"<Response [{self.status_code}]>"


def _encode_query(params: Optional[Mapping[str, Any]]) -> Optional[str]:
    """Encode a params mapping into a query string.

    Values may be scalars or sequences (repeated keys, like ``requests``'
    default ``dict/lists`` behaviour).  ``None`` values are dropped.
    """
    if not params:
        return None
    pairs = []
    for key, value in params.items():
        if value is None:
            continue
        if isinstance(value, (list, tuple, set)):
            for item in value:
                pairs.append((key, str(item)))
        else:
            pairs.append((key, str(value)))
    return urllib.parse.urlencode(pairs)


class Session:
    """Requests-like session: shared default headers + one ``request()`` method.

    Parameters
    ----------
    headers:
        Default headers merged into every request (per-request headers win).
    context:
        Optional :class:`ssl.SSLContext` for TLS customization.
    """

    def __init__(
        self,
        headers: Optional[Mapping[str, str]] = None,
        *,
        context: Optional[ssl.SSLContext] = None,
    ) -> None:
        #: Mutable mapping of default headers applied to every request.
        self.headers: Dict[str, str] = dict(headers or {})
        self._closed = False
        self._context = context or ssl.create_default_context()
        # Follow redirects exactly like urllib does by default; we simply use
        # the default opener builder but inject our SSL context below.
        self._opener = urllib.request.build_opener(
            urllib.request.HTTPSHandler(context=self._context),
            urllib.request.HTTPRedirectHandler(),
        )

    def request(
        self,
        method: str,
        url: str,
        *,
        params: Optional[Mapping[str, Any]] = None,
        data: Optional[Union[bytes, str]] = None,
        headers: Optional[Mapping[str, str]] = None,
        timeout: Optional[float] = 30.0,
    ) -> Response:
        """Perform an HTTP request and return a :class:`Response`.

        ``method`` is any HTTP verb (``GET``, ``POST``, ``PATCH``, ``DELETE``
        ...).  Body-less verbs with ``data`` still work because urllib accepts
        ``data`` for them via ``Request.data``.

        Raises
        ------
        HTTPError
            On network-level failure (DNS, timeout, refused connection).
            Note that non-2xx responses do **not** raise: the caller inspects
            ``response.status_code`` (again mirroring ``requests``).
        """
        query = _encode_query(params)
        if query:
            sep = "&" if "?" in url else "?"
            url = f"{url}{sep}{query}"

        if self.closed:
            raise HTTPError("Session is closed; create a new Session (or client)")

        merged = dict(self.headers)
        merged.update({k: v for k, v in (headers or {}).items() if v is not None})
        # Accept gzip so we can transparently decompress below.
        merged.setdefault("Accept-Encoding", "gzip")

        body = data.encode("utf-8") if isinstance(data, str) else data
        request = urllib.request.Request(url=url, data=body, method=method.upper())
        for key, value in merged.items():
            request.add_header(key, value)

        try:
            raw = self._opener.open(request, timeout=timeout)
        except urllib.error.HTTPError as exc:
            # Non-2xx: urllib raises, but requests-style callers want an object.
            raw = exc
        except (urllib.error.URLError, OSError) as exc:
            reason = getattr(exc, "reason", exc)
            raise HTTPError(f"{type(exc).__name__}: {exc} ({reason})") from exc
        except http.client.HTTPException as exc:  # pragma: no cover - rare
            raise HTTPError(f"{type(exc).__name__}: {exc}") from exc

        with raw:
            content = raw.read()
            status = getattr(raw, "status", None) or raw.code
            headers_msg: Message = raw.headers
            encoding = (headers_msg.get("Content-Encoding") or "").lower()
            if "gzip" in encoding:
                try:
                    content = gzip.GzipFile(fileobj=io.BytesIO(content)).read()
                except OSError:  # pragma: no cover - malformed gzip body
                    pass
            final_url = raw.geturl()
            reason = getattr(raw, "reason", "") or ""

        return Response(status, headers_msg, content, final_url, reason)

    def close(self) -> None:
        """Mark the session closed; further requests raise :class:`HTTPError`.

        urllib has no persistent connections to release, but we still track
        the closed state so misuse is reported with a typed library error
        instead of silently re-opening a new opener.
        """
        self._closed = True

    @property
    def closed(self) -> bool:
        return getattr(self, "_closed", False)


# Small helper used by Transport: serialize a JSON body the way requests does.
def json_dumps(obj: Any) -> str:
    return _json.dumps(obj, separators=(",", ":"), default=str)
