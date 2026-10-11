"""Minimal end-to-end example: project -> task group -> task -> complete.

Run with your REST token exported::

    export SINGULARITY_TOKEN="your-token"
    python examples/quickstart.py
"""

from singularity_client import SingularityClient

# Token is picked up from $SINGULARITY_TOKEN automatically.
client = SingularityClient()

# 1. Create a project (returns ProjectCreateResult: .project + the auto-created
#    default task group .taskGroup -- tasks need that group id)
created = client.projects.create("Quickstart Demo")
project_id = created.project.id
default_group = created.taskGroup.id if created.taskGroup else None
print(f"Created project {project_id!r}")

# 2. Create a task inside the project's default group
task = client.tasks.create(
    "Read the docs",
    projectId=project_id,
    groupId=default_group or None,
    priority=0,               # P0 = highest (see singularity_client.enums.Priority)
)
print(f"Created task {task.id!r} external id {task.externalId!r}")

# 3. Complete it
done = client.tasks.complete(task.id)
print(f"Task completed: checked={done.checked}")

client.close()
