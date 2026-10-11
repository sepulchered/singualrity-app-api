# Getting Started

## 1. Requirements

* Python **3.9+**
* **No third-party packages.** The client ships its own small HTTP layer built
  on `urllib.request`, so it installs and runs anywhere plain Python runs —
  AWS Lambda, Alpine containers, restricted corporate hosts, notebooks.

## 2. Installation

From PyPI:

```bash
pip install singularity-client
```

From this repository (editable, for development):

```bash
git clone <this repo> && cd <repo>
pip install -e .            # runtime needs nothing else
pip install -e ".[dev]"     # adds pytest for running the test-suite
```

Sanity check that you really are dependency-free:

```bash
python -c "import singularity_client, sys; \
print([m for m in sys.modules if 'requests' in m or 'httpx' in m])"
# -> []
```

## 3. Getting a REST token

1. Open the Singularity app → your profile → **Settings**.
2. Go to **Integrations → REST API** and create a *REST token*.
3. Export it to your environment (never hard-code it):

```bash
export SINGULARITY_TOKEN="paste-your-token"
```

## 4. Your first calls

```python
from singularity_client import SingularityClient

client = SingularityClient()          # reads $SINGULARITY_TOKEN
projects = client.projects.list()
for p in projects:
    print(p.id, p.title)
```

Create some work:

```python
res = client.projects.create("Home Renovation", emoji="🏠", color="#8BC34A")
pid = res.project.id                  # P-...
group_id = res.taskGroup.id           # Q-... (default group auto-created)

task = client.tasks.create(
    "Order tiles",
    projectId=pid,
    group=group_id,
    deadline="2026-11-15T10:00:00.000Z",
    priority=1,
    tags=[],
)
print(task.id)                        # T-...
client.tasks.complete(task.id)
```

Habits:

```python
habit = client.habits.create("Morning run", color="green")
client.habit_progress.mark_full(habit.id)        # today = FULL (2)
```

## 5. Listing, filtering, paging

```python
import datetime as dt
from singularity_client.filters import f, filters

today = dt.date.today()
due_soon = client.tasks.list(params=filters(
    f("deadline", "lte", today + dt.timedelta(days=7)),
    f("deadline", "isSet", True),
    checked=0,                       # not completed
    maxCount=100,
    offset=0,
    paginationData=True,
))
print(f"{len(due_soon)} of total {due_soon.pagination.total}")
```

Fetch everything with automatic paging:

```python
def all_tasks(client, **params):
    offset, out = 0, []
    while True:
        page = client.tasks.list(params={**params, "maxCount": 1000, "offset": offset})
        out.extend(page.items)
        if len(page) < 1000:
            return out
        offset += 1000
```

## 6. Batch writes

One HTTP round-trip, later operations can reference earlier ones through
`tempId`:

```python
b = client.batch
ops = [
    b.op("POST", "/v2/project", {"title": "Q4 Launch"}, temp_id="proj"),
    b.op("POST", "/v2/task", {"title": "Plan", "projectId": "proj"}),
    b.op("POST", "/v2/task", {"title": "Execute", "projectId": "proj"}),
]
result = b.execute(ops)
if result.all_ok:
    print("project id:", result.temp_id_map["proj"])
else:
    for err in result.errors():
        print(err.uuid, err.status, err.body)
```

## 7. Handling errors

```python
from singularity_client.exceptions import (
    AuthenticationError, NotFoundError, RateLimitError, SingularityAPIError,
)

try:
    task = client.tasks.get("T-does-not-exist")
except NotFoundError:
    ...                      # id wrong / deleted
except AuthenticationError:
    ...                      # token invalid — do not retry blindly
except RateLimitError as e:
    sleep(e.retry_after or 5)
except SingularityAPIError as e:
    log(e.status_code, e.detail, e.payload)
```

Network problems after retries raise `SingularityConnectionError`.

## 8. Next steps

* AI-agent oriented contract (dense method/param/error reference) → [`agent_reference.md`](agent_reference.md)
* Internals & design decisions → [`architecture.md`](architecture.md)
* Runnable scripts → [`../examples/`](../examples)
