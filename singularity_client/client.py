"""High-level client for the Singularity App REST API v2.

The :class:`SingularityClient` is the single entry point of the library::

    from singularity_client import SingularityClient

    client = SingularityClient(token="YOUR_REST_TOKEN")   # or env SINGULARITY_TOKEN
    result = client.projects.create("My project")
    project_id = result.project.id
    task = client.tasks.create("First task", projectId=project_id, priority=0)
    client.tasks.complete(task.id)

Resources exposed as attributes:

=========================  =============================================  ==================
Attribute                  Endpoints                                      Purpose
=========================  =============================================  ==================
``client.projects``        /v2/project                                    projects
``client.task_groups``     /v2/task-group                                 task groups (Q-)
``client.tasks``           /v2/task                                       tasks/subtasks
``client.kanban_statuses`` /v2/kanban-status                              board columns
``client.kanban_task_statuses`` /v2/kanban-task-status                    task↔column links
``client.habits``          /v2/habit                                      habits
``client.habit_progress``  /v2/habit-progress                             habit daily records
``client.checklist_items`` /v2/checklist-item                             checklist sub-items
``client.tags``            /v2/tag                                        tags (A-)
``client.time_stats``      /v2/time-stat                                  time tracking
``client.batch``           /v2/batch                                      multi-op in one call
=========================  =============================================  ==================

Raw escape hatch: ``client.raw("GET", "/v2/task", params={...})`` returns the
decoded JSON without model conversion -- handy for agents when a typed helper
does not exist yet.
"""

from __future__ import annotations

import os
from typing import Any, Dict, Mapping, Optional

from .exceptions import SingularityConfigurationError
from .resources.batch import BatchResource
from .resources.habits import HabitProgressResource, HabitsResource
from .resources.kanban import KanbanStatusesResource, KanbanTaskStatusesResource
from .resources.misc import ChecklistItemsResource, TagsResource, TimeStatsResource
from .resources.projects import ProjectsResource
from .resources.task_groups import TaskGroupsResource
from .resources.tasks import TasksResource
from ._http import Session
from .transport import DEFAULT_BASE_URL, Transport

ENV_TOKEN = "SINGULARITY_TOKEN"
ENV_BASE_URL = "SINGULARITY_BASE_URL"


class SingularityClient:
    """Typed facade over every Singularity v2 endpoint group.

    Args
    ----
    token:
        Bearer REST token.  Falls back to the ``SINGULARITY_TOKEN`` environment
        variable.  Create it inside the Singularity app (profile → settings →
        integrations / REST API).
    base_url:
        Defaults to ``https://api.singularity-app.com``; override with the
        ``SINGULARITY_BASE_URL`` env var or this parameter (e.g. for tests).
    timeout:
        Per-request timeout in seconds (default 30).
    max_retries:
        Automatic retries for HTTP 429/5xx and network errors (default 2).
        Honours the server ``Retry-After`` header.
    session:
        Optional pre-configured :class:`singularity_client._http.Session`
        (custom TLS context, default headers...).

    Raises
    ------
    SingularityConfigurationError:
        When no token is available *and* ``allow_no_token=False``.
    """

    def __init__(
        self,
        token: Optional[str] = None,
        base_url: Optional[str] = None,
        *,
        timeout: float = 30.0,
        max_retries: int = 2,
        backoff_factor: float = 0.5,
        session: Optional[Session] = None,
        allow_no_token: bool = False,
    ) -> None:
        token = token or os.environ.get(ENV_TOKEN)
        if not token and not allow_no_token:
            raise SingularityConfigurationError(
                "Missing Singularity REST token. Pass token='...' or set the "
                f"{ENV_TOKEN} environment variable."
            )
        base_url = base_url or os.environ.get(ENV_BASE_URL) or DEFAULT_BASE_URL
        self.transport = Transport(
            token=token,
            base_url=base_url,
            timeout=timeout,
            max_retries=max_retries,
            backoff_factor=backoff_factor,
            session=session,
        )
        # Resource groups (instantiated once, cheap).
        self.projects = ProjectsResource(self.transport)
        self.project = self.projects  # singular alias
        self.task_groups = TaskGroupsResource(self.transport)
        self.tasks = TasksResource(self.transport)
        self.kanban_statuses = KanbanStatusesResource(self.transport)
        self.kanban_task_statuses = KanbanTaskStatusesResource(self.transport)
        self.habits = HabitsResource(self.transport)
        self.habit_progress = HabitProgressResource(self.transport)
        self.checklist_items = ChecklistItemsResource(self.transport)
        self.tags = TagsResource(self.transport)
        self.time_stats = TimeStatsResource(self.transport)
        self.batch = BatchResource(self.transport)

    # ------------------------------------------------------------------ #
    # raw access & plumbing
    # ------------------------------------------------------------------ #

    def raw(
        self,
        method: str,
        path: str,
        *,
        params: Optional[Mapping[str, Any]] = None,
        json_body: Optional[Any] = None,
    ) -> Any:
        """Execute an arbitrary API call and return decoded JSON.

        Use when a needed endpoint has no typed helper; identical auth/retry/
        error semantics as typed calls.
        """
        return self.transport.request(method, path, params=params, json_body=json_body)

    def close(self) -> None:
        """Release the underlying HTTP session."""
        self.transport.close()

    def __enter__(self) -> "SingularityClient":
        return self

    def __exit__(self, *exc_info: Any) -> None:
        self.close()

    def __repr__(self) -> str:  # pragma: no cover
        masked = f"{self.transport.token[:6]}..." if self.transport.token else None
        return f"<SingularityClient base_url={self.transport.base_url!r} token={masked!r}>"
