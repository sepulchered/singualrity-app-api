"""singularity_client — zero-dependency Python client for the Singularity App REST API v2.

Quick start::

    from singularity_client import SingularityClient

    client = SingularityClient(token="...")          # or env SINGULARITY_TOKEN
    project = client.projects.create("My project")
    task = client.tasks.create("First task", projectId=project.project.id)
    client.tasks.complete(task.id)

The package is intentionally built **only on the Python standard library**
(``urllib.request`` based HTTP transport in :mod:`singularity_client._http`).

For AI agents: see ``docs/agent_reference.md`` for the complete machine-readable
method catalog, parameter semantics and error contract.
"""

from __future__ import annotations

from ._http import HTTPError, Response, Session
from .client import ENV_BASE_URL, ENV_TOKEN, SingularityClient
from .enums import (
    FILTER_OPS,
    BatchMethod,
    CheckedStatus,
    FilterOp,
    HabitProgress,
    HabitStatus,
    Priority,
    ReviewValidationInterval,
    TaskState,
    TimeStatSource,
)
from .exceptions import (
    AuthenticationError,
    BadRequestError,
    ConflictError,
    NotFoundError,
    RateLimitError,
    ServerError,
    SingularityAPIError,
    SingularityConfigurationError,
    SingularityConnectionError,
    SingularityError,
)
from .filters import clean, f, filters, join_ids, split_list, to_iso_utc
from .models import (
    Base,
    BatchOperation,
    BatchOperationResult,
    BatchResult,
    ChecklistItem,
    EntityList,
    Habit,
    HabitDailyProgress,
    KanbanStatus,
    KanbanTaskStatus,
    Pagination,
    Project,
    ProjectCreateResult,
    Recurrence,
    Tag,
    Task,
    TaskGroup,
    TimeStat,
    parse_timestamp,
)
from .transport import DEFAULT_BASE_URL, RETRYABLE_STATUS, Transport

__version__ = "0.1.0"

__all__ = [
    # client & transport
    "SingularityClient", "Transport", "DEFAULT_BASE_URL", "RETRYABLE_STATUS",
    "ENV_TOKEN", "ENV_BASE_URL", "__version__",
    # stdlib http layer
    "Session", "Response", "HTTPError",
    # exceptions
    "SingularityError", "SingularityConfigurationError", "SingularityConnectionError",
    "SingularityAPIError", "BadRequestError", "AuthenticationError", "NotFoundError",
    "ConflictError", "RateLimitError", "ServerError",
    # enums
    "Priority", "TaskState", "CheckedStatus", "ReviewValidationInterval",
    "HabitStatus", "HabitProgress", "TimeStatSource", "BatchMethod",
    "FilterOp", "FILTER_OPS",
    # filter helpers
    "f", "filters", "clean", "to_iso_utc", "join_ids", "split_list",
    # models
    "Base", "EntityList", "Pagination", "parse_timestamp",
    "Project", "ProjectCreateResult", "TaskGroup", "Recurrence", "Task",
    "KanbanStatus", "KanbanTaskStatus", "Habit", "HabitDailyProgress",
    "ChecklistItem", "Tag", "TimeStat",
    "BatchOperation", "BatchOperationResult", "BatchResult",
]
