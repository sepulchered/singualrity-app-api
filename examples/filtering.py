"""Filtering, pagination-free listing and enum usage.

    export SINGULARITY_TOKEN="your-token"
    python examples/filtering.py
"""

import datetime as dt

from singularity_client import SingularityClient
from singularity_client.enums import Priority
from singularity_client.filters import f, filters

client = SingularityClient()

# Projects: everything that is not archived (archived projects carry journalDate)
projects = client.projects.list(params=filters(
    f("journalDate", "isSet", False),
))
print(f"Active projects: {len(projects)}")
by_id = {p.id: p for p in projects}

# Tasks started this month with priority P0/P1 in a given project
month_start = dt.datetime.now(dt.timezone.utc).replace(
    day=1, hour=0, minute=0, second=0, microsecond=0)

tasks = client.tasks.list(params=filters(
    f("start", "gte", month_start),            # datetime -> ISO-8601 Z string
    f("projectId", "in", list(by_id)[:5]),     # sequences -> comma-joined
    f("priority", "in", [Priority.P0, Priority.P1]),  # enums -> ints
    checked=0,                                 # simple equality
))
print(f"Open high-priority tasks this month: {len(tasks)}")
for t in tasks[:10]:
    print(f"  [{t.priority}] {t.externalId}: {t.title}")

# Time stats for the last 7 days
week_ago = dt.datetime.now(dt.timezone.utc) - dt.timedelta(days=7)
stats = client.time_stats.list(params=filters(f("start", "gte", week_ago)))
total = sum(s.secondsPassed or 0 for s in stats)
print(f"Tracked time in the last 7 days: {total / 3600:.1f} h")

client.close()
