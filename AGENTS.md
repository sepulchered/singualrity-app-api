# AGENTS.md — singularity-client

> This file is the entry point for AI coding agents working with or inside this
> repository. For the full machine-oriented API contract read
> [`docs/agent_reference.md`](docs/agent_reference.md).

## What this project is

`singularity-client` is a Python SDK for the **Singularity App REST API v2**
(projects, task groups, tasks, kanban, habits, checklist items, tags, time
stats, batch operations) hosted at `https://api.singularity-app.com`.

Hard constraint: **zero runtime dependencies — Python ≥ 3.9 standard library
only** (`urllib`, `json`, `dataclasses`, …). Never add third-party imports to
`singularity_client/`; CI enforces this with an AST-based stdlib-only gate.

## Quick facts for agents

| Fact | Value |
|---|---|
| Import name | `singularity_client` (pip name `singularity-client`) |
| Entry point | `SingularityClient(token=...)` — token falls back to `$SINGULARITY_TOKEN` |
| Base URL override | `$SINGULARITY_BASE_URL` or `base_url=` kwarg (tests use a local fake server) |
| Auth | `Authorization: Bearer <token>` header |
| Timestamps on the wire | ISO-8601 UTC with millis + `Z` (`2026-07-01T00:00:00.000Z`); `filters.to_iso_utc()` normalizes `datetime`/`date` |
| Filtering | query params `field.op` via `filters.f(field, op, value)` / `filters.filters(...)`; ops: eq, ne, in, gt, gte, lt, lte, isSet |
| Errors | typed hierarchy rooted at `SingularityAPIError` (see docs §6); retries on 429/5xx honour `Retry-After` |
| Unknown endpoint | escape hatch `client.raw("GET", "/v2/task", params=...)` returns decoded JSON |
| Batch | `client.batch.op(...)` + `client.batch.execute(ops)`; cross-ref new entities via `temp_id`; ALWAYS check `result.all_ok` / `result.errors()` |

## Repository layout

```
singularity_client/        the library (stdlib only)
  client.py                SingularityClient facade (resource attributes + raw())
  transport.py             auth, param normalization, retries, error mapping
  _http.py                 urllib-based session (connection reuse, timeouts)
  resources/*.py           one module per endpoint group
  models*.py               dataclass response models (lenient: unknown fields kept in _extra)
  filters.py enums.py exceptions.py
tests/                     pytest suite; fake API = real stdlib ThreadingHTTPServer (no mocks)
docs/agent_reference.md    dense method catalog + recipes + do/don't  <-- READ THIS before coding against the API
docs/getting_started.md    human setup guide
docs/architecture.md       design notes
examples/                  runnable scripts (quickstart, filtering, batch_operations)
openapi.json               source-of-truth API spec extracted from swagger-ui-init.js
.github/workflows/         ci.yml (lint+tests+build), publish.yml (tag -> GitHub Release + PyPI)
```

## How to verify changes locally

```bash
python -m pip install -e ".[dev]"   # dev extra installs pytest only
python -m pytest                    # 100 tests, ~40s, all offline (local HTTP server)
python -m compileall -q singularity_client tests
```

Do not call the live API from tests; extend `tests/conftest.py::FakeAPI` instead.

## Conventions when modifying code

1. New endpoints → add a method to the matching `resources/*.py` class, parse
   into a dataclass model, cover with tests against `FakeAPI`, and update
   `docs/agent_reference.md` §3 catalog + README resource table.
2. Keep every public docstring accurate — agents read them programmatically.
3. Models are lenient by design: unknown server fields go to `_extra`, never
   raise on unexpected keys.
4. Release flow: bump `version` in `pyproject.toml`, commit, then
   `git tag vX.Y.Z && git push origin vX.Y.Z` — publish.yml verifies tag ==
   pyproject version, runs full CI, creates the GitHub Release and publishes
   to PyPI (trusted publishing).

## Known API quirks (learned from the spec — trust these over guesses)

* `POST /v2/project` returns `{project, taskGroup}` — tasks require the
  `taskGroup.id` as `groupId` together with `projectId`.
* Entity ids are prefixed: projects `P-…`, task groups `Q-…`, tasks `T-…`,
  habits `HB-…`, tags `A-…`, kanban statuses `KS-…`.
* Archive = setting `journalDate`; remove/basket = `deleteDate`; both appear
  on entities and double as filter fields.
* Batch supports only POST/PATCH/DELETE with paths starting `/v2/`; individual
  operation failures do NOT fail the batch call itself.
