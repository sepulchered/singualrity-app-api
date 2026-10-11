# Singularity API client

[![python](https://img.shields.io/badge/python-3.9%2B-blue)]()
[![deps](https://img.shields.io/badge/dependencies-none%20(stdlib%20only)-brightgreen)]()

**singularity-client** is a clean, well-documented Python SDK for the
[Singularity App](https://singularity-app.com) REST API v2
(`https://api.singularity-app.com/v2`).

* **Zero third-party dependencies** — pure Python standard library
  (`urllib.request` based HTTP layer). Works anywhere Python works: serverless,
  Alpine images, locked-down corporate machines, `python:slim`, Colab…
* **Typed, dataclass-based models** for projects, tasks, task groups, kanban,
  habits, habit progress, checklist items, tags, time stats and batch results.
* **Agent-friendly**: tolerant parsing (unknown server fields are preserved),
  rich docstrings on every method, deterministic exceptions with machine
  readable attributes, and a raw escape hatch (`client.raw(...)`).
* **Robust transport**: Bearer auth, JSON handling, retries with exponential
  backoff honouring `Retry-After`, typed error mapping.

## Install

```bash
pip install singularity-client        # or: pip install -e .  from this repo
```

No optional extras are needed at runtime. Tests require only `pytest`.

## Quick start

```python
from singularity_client import SingularityClient, Priority

client = SingularityClient(token="...")   # or set env SINGULARITY_TOKEN

# Create a project -> returns ProjectCreateResult (.project and its default .taskGroup)
res = client.projects.create("Roadmap 2026", color="#FF5722")
project_id = res.project.id

# Create a task inside it
task = client.tasks.create(
    "Draft the kickoff deck",
    projectId=project_id,
    priority=Priority.HIGH,
    deadline="2026-11-01T09:00:00.000Z",
)

# Complete it
client.tasks.complete(task.id)

# List open tasks of the project
open_tasks = client.tasks.list(params={"projectId": project_id, "checked.isSet": False})
for t in open_tasks:
    print(t.id, t.title)
```

Context-manager form (closes the session):

```python
with SingularityClient() as client:      # token from $SINGULARITY_TOKEN
    habits = client.habits.list()
```

## Where to get the token

Singularity app → profile → *Settings* → *Integrations* → **REST API** → create
a REST token. Keep it out of source control; prefer the `SINGULARITY_TOKEN`
environment variable.

## Documentation map

| File | Audience | Content |
|---|---|---|
| [`README.md`](README.md) | humans | this file — install, quickstart, overview |
| [`docs/agent_reference.md`](docs/agent_reference.md) | **AI agents** | dense machine-oriented contract: every method, params, returns, errors, recipes |
| [`docs/getting_started.md`](docs/getting_started.md) | humans | setup, token, first calls, common workflows |
| [`docs/architecture.md`](docs/architecture.md) | devs/contributors | design, stdlib-only HTTP layer, retry/error model |
| [`examples/`](examples/) | everyone | runnable end-to-end scripts |

## Resource groups

| Attribute | Endpoints | Purpose |
|---|---|---|
| `client.projects` | `/v2/project` | projects (`P-…`), archive/unarchive/delete |
| `client.task_groups` | `/v2/task-group` | task groups (`Q-…`) inside projects |
| `client.tasks` | `/v2/task` | tasks (`T-…`), complete/cancel/move/change-column |
| `client.kanban_statuses` | `/v2/kanban-status` | board columns (`KS-…`) |
| `client.kanban_task_statuses` | `/v2/kanban-task-status` | task↔column links (`KTS-…`) |
| `client.habits` | `/v2/habit` | habits (`HB-…`) |
| `client.habit_progress` | `/v2/habit-progress` | daily habit records |
| `client.checklist_items` | `/v2/checklist-item` | checklist sub-items (`CI-…`) |
| `client.tags` | `/v2/tag` | tags (`A-…`) |
| `client.time_stats` | `/v2/time-stat` | pomodoro/stopwatch time tracking |
| `client.batch` | `/v2/batch` | many POST/PATCH/DELETE ops in one round-trip |

## Filtering & pagination

List endpoints accept `field.op` query filters (`eq`, `ne`, `in`, `gt`, `gte`,
`lt`, `lte`, `isSet`) plus `maxCount` (≤1000), `offset`, `modifiedSince`,
`paginationData`:

```python
import datetime as dt
from singularity_client import SingularityClient
from singularity_client.filters import f, filters

client = SingularityClient()
week_ago = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=7)

tasks = client.tasks.list(params=filters(
    f("start", "gte", week_ago),
    f("projectId", "in", ["P-aaa", "P-bbb"]),
    checked=0,
    maxCount=200,
    paginationData=True,
))
print(len(tasks), tasks.pagination.total)
```

⚠️ Spec caveat: with recurring tasks and the default
`includeAllRecurrenceInstances=false`, offset pagination can show gaps — pass
`includeAllRecurrenceInstances=True` for reliable paging.

## Batch operations (one round-trip, temp id references)

```python
from singularity_client import SingularityClient

client = SingularityClient()
b = client.batch
op1 = b.op("POST", "/v2/project", {"title": "Batch demo"}, temp_id="proj")
op2 = b.op("POST", "/v2/task", {"title": "Task in new project", "projectId": "proj"})
result = b.execute([op1, op2])

assert result.all_ok
new_project_id = result.temp_id_map["proj"]     # real P-... id
created_task = result.by_uuid(op2.uuid).body    # per-op response + status
```

## Errors

Everything raises subclasses of `SingularityError`:

```
SingularityError
├── SingularityConfigurationError   mis-use of the client itself
├── SingularityConnectionError      network failure after retries
└── SingularityAPIError             non-2xx HTTP (status_code, payload, detail)
    ├── BadRequestError             400 / 422
    ├── AuthenticationError         401 / 403
    ├── NotFoundError               404
    ├── ConflictError               409
    ├── RateLimitError              429 (+ retry_after seconds)
    └── ServerError                 5xx
```

## Why no dependencies?

The HTTP layer (`singularity_client/_http.py`) implements exactly what the API
needs on top of `urllib.request`: persistent default headers, gzip decoding,
timeouts, redirects, and a requests-compatible `Response` object. This means:

* `pip install singularity-client` pulls **nothing else**;
* the client runs on any Python ≥ 3.9 without compilation or extra wheels;
* behaviour is fully auditable in ~230 lines of stdlib code.

If you already use `requests` elsewhere, nothing conflicts — the client simply
doesn't need it. You can also inject your own session-like object via
`SingularityClient(session=...)` (must expose `.headers` dict and
`.request(method, url, *, params, data, headers, timeout)` returning an object
with `status_code/headers/content/json()`).

## Development & tests

```bash
pip install -e ".[dev]"
pytest            # uses a stdlib http.server test fixture — no mocking libs
```

## Disclaimer

Unofficial community client. Not affiliated with the Singularity app authors.
API spec snapshot: `openapi.json` (extracted from
`https://api.singularity-app.com/v2/api/swagger-ui-init.js`).
