# Agent Reference — singularity_client

> Machine-oriented contract for AI agents. Dense, complete, unambiguous.
> Human prose lives in `getting_started.md` / `architecture.md`.

## 0. Identity

* Package: `singularity_client` (PyPI name `singularity-client`)
* Runtime dependencies: **NONE** (Python ≥ 3.9 standard library only)
* API base: `https://api.singularity-app.com` (env override: `SINGULARITY_BASE_URL`)
* Auth: HTTP header `Authorization: Bearer <REST token>` (env: `SINGULARITY_TOKEN`)
* All payloads are JSON. Timestamps on the wire: ISO-8601 with milliseconds and
  `Z` (`2026-07-01T00:00:00.000Z`) or epoch-millisecond strings; some fields
  return `YYYY-MM-DD`.

## 1. Construction

```python
from singularity_client import SingularityClient

client = SingularityClient(
    token=None,            # falls back to $SINGULARITY_TOKEN; None + allow_no_token=False -> raise
    base_url=None,         # falls back to $SINGULARITY_BASE_URL then DEFAULT_BASE_URL
    timeout=30.0,          # seconds per request
    max_retries=2,         # auto-retry on 429/5xx/network errors
    backoff_factor=0.5,    # exponential base; Retry-After header honoured when present
    session=None,          # optional custom _http.Session (or duck-typed requests-like)
    allow_no_token=False,  # set True for offline probing / tests
)
```

Raises `SingularityConfigurationError` if token missing (and not allowed) or
`base_url` scheme is not http/https. Use as context manager to close transport.

## 2. Escape hatch

```python
data = client.raw("GET", "/v2/task", params={"maxCount": 10})       # decoded JSON | None
client.raw("POST", "/v2/tag", json_body={"title": "urgent"})
```

Same auth/retry/error semantics as typed calls. Prefer typed methods; use
`raw()` for endpoints lacking helpers or when raw dicts are cheaper to parse.

## 3. Method catalog

Legend: `→ T` returns typed model; `→ EntityList[T]` returns list wrapper
(`.items`, `.pagination`, len/iter/indexable); `params=` accepts a dict of
query parameters/filters.

### client.projects  (`/v2/project`)
| call | notes |
|---|---|
| `.list(params=None)` → EntityList[Project] | keys: `includeArchived`, `includeRemoved`, `parent`, `parent.in`, `maxCount`, `offset`, `modifiedSince`, `paginationData`, filters `journalDate.isSet`, `deleteDate.isSet`, `start.gte/lte`, `end.gte/lte` |
| `.get(id, include_removed=None, fields=None)` → Project? | id format `P-...`; 404 → NotFoundError |
| `.create(title, **fields)` → ProjectCreateResult | fields: `note,start,end,journalDate,showInBasket,emoji,color(#RRGGBB),externalId,reviewValidationDate,reviewValidationInterval(int -1..6),parent(P-...),parentOrder,isNotebook`. Result has `.project` and auto-created default `.taskGroup` |
| `.update(id, **fields)` → Project | PATCH partial; ValueError if no fields |
| `.delete(id)` → None | 204; moves to basket |
| `.archive(id, journal_date=None)` → Project | POST `/archive` |
| `.unarchive(id)` → Project | POST `/unarchive` |

### client.task_groups  (`/v2/task-group`)
`.list(params)` / `.get(id)` / `.create(title, parent, **fields{externalId,parentOrder,fake})` /
`.update(id, **f)` / `.delete(id)`. Ids `Q-...`; `parent` = project id. Title must be empty when `fake=True`.

### client.tasks  (`/v2/task`)
| call | notes |
|---|---|
| `.list(params=None)` → EntityList[Task] | keys incl. `projectId`, `group`, `parent`, `checked`, `priority`, `state`, `deferred`, `isNote`, `tags` (comma A-ids), `includeArchived/Removed/AllRecurrenceInstances`, `start/deadline/journalDate/deleteDate` (+ `.eq/ne/in/gt/gte/lt/lte/isSet`) |
| `.get(id, include_removed=None, fields=None)` → Task? | ids `T-...` |
| `.create(title, **fields)` → Task | fields: `projectId,group,parent,note(delta text),priority(0 high/1 normal/2 low),start,deadline,timeLength(minutes),notifies(list[int] minutes-before),alarmNotify,checked(0/1/2),state(0 pinned/1 unpinned),complete(0..999 percent),tags(list[A-...]),externalId,isNote,deferred,useTime,showInBasket,deleteDate,journalDate` |
| `.update(id, **fields)` → Task | PATCH |
| `.delete(id)` → None | basket |
| `.complete(id)` / `.uncomplete(id)` / `.cancel(id)` / `.complete_today(id)` → Task | POST lifecycle actions |
| `.archive(id, journal_date=None)` / `.unarchive(id)` → Task | |
| `.move(id, project_id, group_id=None, parent=None)` → Task | POST `/move` |
| `.change_column(id, status_id)` → Task | kanban move, `KS-...` |
| `.list_by_project(project_id, **params)` → EntityList[Task] | shorthand |
| `.find_by_external_id(external_id)` → List[Task] | client-side scan of first 1000 |

Task booleans: `.is_completed` (checked==1), `.is_cancelled` (checked==2),
`.is_archived`, `.is_removed`; datetimes: `.start_datetime`, `.deadline_datetime`.

### client.kanban_statuses  (`/v2/kanban-status`)
`.list(params)` / `.get(id)` / `.create(name, project_id, **fields{externalId,kanbanOrder,numberOfColumns 1..100})` / `.update(id,**f)` / `.delete(id)`. Ids `KS-...`.

### client.kanban_task_statuses  (`/v2/kanban-task-status`)
`.list(params{taskId,statusId,*.in})` / `.get(id)` / `.create(task_id, status_id, **fields{externalId,kanbanOrder})` / `.update` / `.delete`. Ids `KTS-...`.

### client.habits  (`/v2/habit`)
`.list(params{includeArchived,status,...})` / `.get(id)` /
`.create(title, **fields{description,color,order,status,externalId})` where
`color ∈ red,pink,purple,deepPurple,indigo,lightBlue,cyan,teal,green,lightGreen,lime,yellow,amber,orange,deepOrange,brown,grey,blueGrey`;
REST allows only `status` 0 ACTIVE / 2 ARCHIVED.
`.update(id,**f)` / `.delete(id)` / `.archive(id)` (=status 2) / `.unarchive(id)` (=status 0). Ids `HB-...`.

### client.habit_progress  (`/v2/habit-progress`)
`.list(params{habit,date,startDate,endDate,*.in,gte,lte})` / `.get(id)` /
`.create(habit_id, date, progress, **fields{externalId})` (`progress`: 0 EMPTY / 1 SKIP / 2 FULL; `date` str `YYYY-MM-DD` or `datetime.date`) /
`.mark_full(habit_id, date=None)` convenience / `.update(id,**f)` / `.delete(id)`.

### client.checklist_items  (`/v2/checklist-item`)
`.list(params{parent,...})` / `.get(id)` / `.create(parent, title, **fields{parentOrder})`
(`parent` = task id `T-...`) / `.update(id,**f)` / `.delete(id)` / `.check(id)` / `.uncheck(id)`. Ids `CI-...`.

### client.tags  (`/v2/tag`)
`.list(params)` / `.get(id)` / `.create(title, **fields{hotkey int 65..90 excl 84, parent A-..., parentOrder, color #RRGGBB})` / `.update` / `.delete`. Ids `A-...`.

### client.time_stats  (`/v2/time-stat`)
`.list(params{date,dateFrom,dateTo,relatedTaskId,...})` / `.get(id)` /
`.create(start, seconds_passed, **fields{relatedTaskId,source})`
(`source`: 0 POMODORO ≤7200s, 1 STOPWATCH ≤86400s) / `.update` / `.delete(id)` /
`.delete_bulk(date_from=None, date_to=None, related_task_id=None) → int deletedCount`.
Model property: `.duration → timedelta`.

### client.batch  (`/v2/batch`)
```python
op  = client.batch.op(method, path, body=None, *, uuid=None, temp_id=None) -> BatchOperation
res = client.batch.execute([op1, op2, ...]) -> BatchResult
```
Rules: `method ∈ POST/PATCH/DELETE` (ValueError otherwise); `path` must start
with `/v2/`; order matters — later ops may reference earlier ops' `temp_id`
instead of real ids. `BatchResult`: `.results` (list of
`.uuid/.status/.body`, `.ok`), `.all_ok`, `.errors()`, `.by_uuid(u)`,
`.temp_id_map {tempId: realId}`. Missing uuids are auto-filled (uuid4).
The batch HTTP call succeeds even if individual operations fail — always check
per-op statuses.

## 4. Filters & params

```python
from singularity_client.filters import f, filters, to_iso_utc, clean, join_ids

f("start", "gte", "2026-01-01T00:00:00.000Z")   # {'start.gte': '...'}
f("projectId", "in", ["P-1", "P-2"])            # {'projectId.in': 'P-1,P-2'}
f("journalDate", "isSet", False)                # {'journalDate.isSet': False}
filters(f("checked","eq",0), maxCount=100, paginationData=True)
```

Ops: `eq ne in gt gte lt lte isSet` (anything else → SingularityConfigurationError).
Transport auto-normalizes params: `bool→"true"/"false"`, enums→value,
`date/datetime→ISO`, lists→comma-joined, `None` dropped.

Pagination: `maxCount` (default 100, max 1000), `offset`, `paginationData=true`
fills `EntityList.pagination` (`total,count,offset`). Delta sync:
`modifiedSince=<epoch ms or ISO>`. Recurrence caveat: set
`includeAllRecurrenceInstances=true` for gap-free offset paging.

## 5. Enums (IntEnum — usable anywhere an int is expected)

`Priority(HIGH=0,NORMAL=1,LOW=2)` · `TaskState(PINNED=0,UNPINNED=1)` ·
`CheckedStatus(EMPTY=0,CHECKED=1,CANCELLED=2)` ·
`ReviewValidationInterval(DEF=-1,NEVER=0,ONEWEEK=1,TWOWEEKS=2,ONEMONTH=3,SIXMONTH=4)` ·
`HabitStatus(ACTIVE=0,PAUSED=1,ARCHIVED=2,DELETED=3)` (REST: only 0/2) ·
`HabitProgress(EMPTY=0,SKIP=1,FULL=2)` · `TimeStatSource(POMODORO=0,STOPWATCH=1)` ·
`BatchMethod(POST,PATCH,DELETE)` · `FilterOp(eq,ne,in,gt,gte,lt,lte,isSet)`

## 6. Errors (catchability ladder)

```
SingularityError
├── SingularityConfigurationError        bad client usage (no token, bad base_url, bad filter op)
├── SingularityConnectionError           network failure after retries exhausted
└── SingularityAPIError                  non-2xx; attrs: status_code, payload, text, detail, method, url
    ├── BadRequestError                  400, 422
    ├── AuthenticationError              401, 403 (token invalid/expired/missing)
    ├── NotFoundError                    404
    ├── ConflictError                    409
    ├── RateLimitError                   429; extra attr retry_after: float|None (seconds)
    └── ServerError                      >=500
```

Retry policy inside transport: statuses {429,500,502,503,504} and network
errors retried `max_retries` times; delay = `Retry-After` header if numeric
(capped 60s) else `backoff_factor * 2**attempt` (capped 60s). After retries
fail you still get the typed error above — never a raw HTTP exception.

## 7. Models

All models are dataclasses inheriting tolerant `Base`:
`from_dict` ignores unknown keys (kept in `_extra`), `to_dict(drop_none=True)`
round-trips including `_extra`. Entities: `Project, ProjectCreateResult,
TaskGroup, Task, Recurrence, KanbanStatus, KanbanTaskStatus, Habit,
HabitDailyProgress, ChecklistItem, Tag, TimeStat, BatchOperation,
BatchOperationResult, BatchResult, EntityList, Pagination`.
Helper: `parse_timestamp(str|int) -> aware UTC datetime | None`.

## 8. Recipes (copy-paste safe)

**Delta-sync tasks changed since last run**
```python
since = 1735689600000  # epoch ms stored by agent between runs
tasks = client.tasks.list(params={"modifiedSince": since, "maxCount": 1000,
                                  "includeAllRecurrenceInstances": True})
new_since = max(int(t.modificatedDate) for t in tasks if t.modificatedDate) if len(tasks) else since
```

**Ensure-by-external-id (idempotent create)**
```python
found = client.tasks.find_by_external_id("erp-42")
task = found[0] if found else client.tasks.create("Synced task", projectId=pid, externalId="erp-42")
```

**Bulk build a board in one round-trip**
```python
b = client.batch
ops = [b.op("POST", "/v2/kanban-status", {"name": n, "projectId": pid}, temp_id=f"ks-{n}")
       for n in ("Todo", "Doing", "Done")]
r = b.execute(ops)
assert r.all_ok, r.errors()
column_ids = r.temp_id_map   # {'ks-Todo': 'KS-...', ...}
```

**Safe error loop for agents**
```python
from singularity_client.exceptions import SingularityAPIError, AuthenticationError
try:
    ...
except AuthenticationError:      # stop: token problem, do not retry
    raise
except SingularityAPIError as e: # log e.status_code, e.detail, e.payload
    ...
```

## 9. Do / Don't

* ✅ Pass entity ids exactly as returned (`P-…`, `T-…`, `Q-…`, `KS-…`, `KTS-…`, `HB-…`, `CI-…`, `A-…`).
* ✅ Send ints for enum-ish fields (or the IntEnums — serialized automatically).
* ✅ Use `client.batch` instead of N sequential writes when operations are independent or chained via `tempId`.
* ✅ Trust `NotFoundError` from `.get()` for missing ids; `.create()` raises `BadRequestError` on validation failure (inspect `.payload`).
* ❌ Don't pass Python `True/False` in JSON bodies expecting query-string behavior — bodies keep real booleans (server accepts them); query params are normalized to `"true"/"false"` automatically.
* ❌ Don't parse timestamps manually — use `parse_timestamp()` / model properties.
* ❌ Don't catch bare `Exception` around client calls; use the ladder in §6.
