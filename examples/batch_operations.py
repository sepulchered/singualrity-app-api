"""Batch operations: many writes in ONE HTTP round-trip with tempId linking.

    export SINGULARITY_TOKEN="your-token"
    python examples/batch_operations.py
"""

from singularity_client import SingularityClient

client = SingularityClient()

batch = client.batch

# Create a project; its default task group gets created server-side too.
# We reference the *new* project id via a tempId in later operations.
ops = [
    batch.op("POST", "/v2/project", {"title": "Batch Demo"},
             temp_id="new-project"),
    batch.op("POST", "/v2/task",
             {"title": "First", "projectId": "new-project", "priority": 1}),
    batch.op("POST", "/v2/task",
             {"title": "Second", "projectId": "new-project", "priority": 0}),
]

result = batch.execute(ops)

# The batch call itself succeeded; per-operation statuses live in result.results
print("All operations OK:", result.all_ok)
for item in result.results:
    print(f"op {item.uuid}: status={item.status} ok={item.ok}")

print("tempId map:", result.temp_id_map)   # {"new-project": "P-..."}
if not result.all_ok:
    for bad in result.errors():
        print("failed op:", bad.status, bad.body)

# Escape hatch: raw() returns decoded JSON without model conversion.
raw_projects = client.raw("GET", "/v2/project")
print("Raw response keys:", list(raw_projects)[:5] if isinstance(raw_projects, dict)
      else f"{len(raw_projects)} items")

client.close()
