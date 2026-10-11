"""Shared pytest fixtures: a real local HTTP server built from stdlib only.

No mocking libraries are needed: :class:`FakeAPI` runs an actual
``ThreadingHTTPServer`` on an ephemeral port, records every incoming request
and replies with programmable canned responses — exactly what the Singularity
API contract requires us to verify (paths, query strings, headers, JSON bodies).
"""

from __future__ import annotations

import json
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any, Dict, List, Optional, Tuple, Union

import pytest

from singularity_client import SingularityClient


class _Rule:
    def __init__(self, method: str, path_start: str, status: int, body: Any,
                 headers: Optional[Dict[str, str]] = None, repeat: int = 1) -> None:
        self.method = method.upper()
        self.path_start = path_start
        self.status = status
        self.body = body                      # dict/list -> JSON, str/bytes -> raw, None -> empty
        self.headers = headers or {}
        self.repeat = repeat                  # how many requests this rule absorbs

    def matches(self, method: str, path: str) -> bool:
        return (self.method in ("*", method)) and path.startswith(self.path_start)


class FakeAPI:
    """Programmable fake REST API + request journal."""

    def __init__(self) -> None:
        self.rules: List[_Rule] = []
        self.requests: List[Dict[str, Any]] = []   # journal of received requests
        self.default_status = 200
        self.default_body: Any = {}
        fake = self

        class Handler(BaseHTTPRequestHandler):
            protocol_version = "HTTP/1.1"

            def log_message(self, *args):  # silence stderr spam
                pass

            def _handle(self) -> None:
                length = int(self.headers.get("Content-Length") or 0)
                raw = self.rfile.read(length) if length else b""
                parsed_path = self.path.split("?", 1)
                record = {
                    "method": self.command,
                    "path": parsed_path[0],
                    "query": parsed_path[1] if len(parsed_path) > 1 else "",
                    "headers": {k.lower(): v for k, v in self.headers.items()},
                    "raw_body": raw,
                }
                try:
                    record["json"] = json.loads(raw) if raw else None
                except ValueError:
                    record["json"] = None
                fake.requests.append(record)

                rule = fake._consume_rule(self.command, record["path"])
                status = rule.status if rule else fake.default_status
                body = rule.body if rule else fake.default_body
                extra_headers = rule.headers if rule else {}

                if isinstance(body, (dict, list)):
                    payload = json.dumps(body).encode("utf-8")
                    ctype = "application/json; charset=utf-8"
                elif isinstance(body, bytes):
                    payload = body
                    ctype = "application/octet-stream"
                elif isinstance(body, str):
                    payload = body.encode("utf-8")
                    ctype = "text/plain; charset=utf-8"
                else:
                    payload = b""
                    ctype = "application/json"

                self.send_response(status)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", str(len(payload)))
                for key, value in extra_headers.items():
                    self.send_header(key, value)
                self.end_headers()
                if payload and self.command != "HEAD":
                    self.wfile.write(payload)

            do_GET = do_POST = do_PATCH = do_DELETE = do_PUT = _handle

        self._server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        self._server.daemon_threads = True
        self._thread = threading.Thread(target=self._server.serve_forever, daemon=True)
        self._thread.start()

    # ------------------------------------------------------------------ #

    @property
    def base_url(self) -> str:
        host, port = self._server.server_address[:2]
        return f"http://{host}:{port}"

    def stub(self, method: str, path_start: str, *, status: int = 200,
             json_body: Any = None, raw_body: Any = None,
             headers: Optional[Dict[str, str]] = None, repeat: int = 1) -> None:
        """Register a canned response for requests whose path starts with *path_start*."""
        body = json_body if json_body is not None else raw_body
        self.rules.append(_Rule(method, path_start, status, body, headers, repeat))

    def _consume_rule(self, method: str, path: str) -> Optional[_Rule]:
        for i, rule in enumerate(self.rules):
            if rule.matches(method, path):
                rule.repeat -= 1
                if rule.repeat <= 0:
                    self.rules.pop(i)
                return rule
        return None

    def last_request(self) -> Dict[str, Any]:
        assert self.requests, "no request was recorded"
        return self.requests[-1]

    def stop(self) -> None:
        self._server.shutdown()
        self._server.server_close()
        self._thread.join(timeout=5)


@pytest.fixture()
def api():
    fake = FakeAPI()
    yield fake
    fake.stop()


@pytest.fixture()
def client(api):
    c = SingularityClient(token="test-token", base_url=api.base_url, max_retries=0)
    yield c
    c.close()
