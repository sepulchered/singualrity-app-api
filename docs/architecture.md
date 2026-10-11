# Architecture & Design

```
singularity_client/
├── __init__.py            public exports (client, models, enums, exceptions, filters)
├── _http.py               stdlib-only HTTP layer (urllib.request wrapper)   ← no deps
├── transport.py           auth, JSON, param normalization, retries, error mapping
├── client.py              SingularityClient facade + resource wiring + raw()
├── exceptions.py          typed exception hierarchy + error_from_response()
├── enums.py               IntEnum/str Enum mirrors of API integer fields
├── filters.py             f()/filters()/to_iso_utc()/clean() query helpers
├── models_base.py         tolerant Base dataclass, EntityList, Pagination, parse_timestamp
├── models_taskgroup.py    TaskGroup (own module to break import cycle)
├── models.py              Project/Task/Habit/... DTOs mirroring openapi.json schemas
└── resources/
    ├── base.py            Resource: shared _list/_get/_post/_patch/_delete plumbing
    ├── projects.py  task_groups.py  tasks.py  kanban.py
    ├── habits.py    misc.py (checklist items, tags, time stats)  batch.py
```

## Why a hand-rolled HTTP layer?

The library must run with **only the Python standard library**. `_http.py`
therefore implements the ~5 % of `requests` we actually use:

| Feature | Implementation |
|---|---|
| verbs incl. PATCH | `urllib.request.Request(method=...)` |
| default headers | `Session.headers` dict merged per request |
| query strings | `_encode_query()` (repeated keys for sequences) |
| JSON bodies | `json_dumps()` + `Content-Type: application/json` set by Transport |
| gzip responses | transparent `gzip.GzipFile` decode when `Content-Encoding: gzip` |
| redirects | urllib's `HTTPRedirectHandler` (GET/HEAD only, like browsers) |
| timeouts | `opener.open(timeout=...)` |
| non-2xx | urllib raises `HTTPError`; we convert it into a normal `Response` so callers just inspect `status_code` |
| network failures | `URLError`/`OSError`/`HTTPException` normalized into `HTTPError` |

`Response` deliberately mirrors `requests.Response` (`status_code`, `headers`
(case-insensitive `email.message.Message`), `content`, `text`, `json()` raising
`ValueError` on bad JSON). That keeps `transport.py` and `exceptions.py`
unchanged in spirit and lets users inject any duck-typed session via
`SingularityClient(session=...)`.

## Request lifecycle

```
SingularityClient.tasks.create(...)
      │  clean({"title": ..., **fields})            # filters.clean drops None, unwraps Enums
      ▼
Resource._post → Transport.request("POST", "/v2/task", json_body=...)
      │  normalize_params()        bool→"true"/"false", date→ISO, list→csv, None dropped
      │  json_dumps(body)          + Content-Type / Authorization headers
      ▼
_http.Session.request              urllib round-trip (timeout, gzip, redirects)
      │
      ├─ network error ──► retry loop (backoff_factor * 2**attempt, cap 60 s)
      ├─ 429/5xx ────────► honour Retry-After, else backoff; after max_retries ►
      │                     exceptions.error_from_response() → typed SingularityAPIError
      └─ 2xx ────────────► 204/empty → None ; else response.json()
```

## Error model

Single root `SingularityError`. Two "local" subclasses
(`Configuration`, `Connection`) and one HTTP branch `SingularityAPIError`
whose subclasses are chosen by status code (see README diagram). Every API
error carries `status_code`, decoded `payload` (when JSON), raw `text`,
best-effort `detail`, plus `method`/`url` for logs. `RateLimitError` adds
`retry_after`. This gives agents deterministic, machine-readable failure data
without parsing strings.

## Tolerant models

Server DTOs evolve; clients must not. `Base.from_dict` binds only known
dataclass fields and parks unknown ones in `_extra`; `to_dict()` merges them
back, so read-modify-write cycles never drop server data. Timestamps stay raw
strings on the models (some fields are epoch-ms strings, some ISO, some dates);
`parse_timestamp()` normalizes all three into aware UTC datetimes, exposed via
convenience properties (`task.start_datetime`, …).

## Batch semantics

`POST /v2/batch` is modeled as two steps: build `BatchOperation`s (validated
client-side: method ∈ POST/PATCH/DELETE, path starts with `/v2/`) and
`execute()` which auto-fills correlation UUIDs and parses `tempIdMap`. The
batch call itself returns 200 even when individual operations fail — hence
`BatchResult.all_ok` / `.errors()` exist and docs insist on checking them.

## Testing strategy

* `tests/conftest.py` spins a real HTTP server from stdlib
  (`http.server.ThreadingHTTPServer`) that records requests and replays
  canned responses — zero mocking frameworks.
* Tests cover: param normalization, header/auth injection, retry/backoff
  behaviour (including `Retry-After`), every exception mapping, model
  tolerance/round-trips, filter builders, each resource group's URL/verb/body
  contract, batch temp-id flow, and gzip decoding.
* Doctests in `filters`/`models_base` run under pytest too.

## Extending

1. Add/adjust DTO in `models.py` (tolerant by construction — usually nothing needed).
2. Add methods on the matching `resources/*.py` using `_list/_get/_post/_patch/_delete`.
3. Wire new resource in `client.py` + export in `__init__.py`.
4. Add a test against the fake server asserting exact path/params/body.
5. Update `docs/agent_reference.md` catalog (agents treat it as the source of truth).
