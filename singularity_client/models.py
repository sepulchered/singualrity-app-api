"""Dataclass models mirroring the Singularity API v2 DTO schemas.

Design notes (important for both humans and AI agents):

* Every model is **tolerant**: unknown server fields are kept in ``_extra``
  and missing optional fields default to ``None`` -- so new server fields
  never break deserialization, and partial payloads always parse.
* ``from_dict`` / ``to_dict`` round-trip JSON bodies.  ``to_dict`` drops
  ``None`` values by default (matching what the API expects for PATCH).
* Enum-ish integer fields are exposed as plain ints; use the helpers in
  :mod:`singularity_client.enums` when *writing* them.
* Timestamps are returned as raw strings from the server (epoch-ms strings
  such as ``"1633021234567"`` or ISO-8601 depending on field); use
  :func:`parse_timestamp` to normalize them.
"""

from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional

from .models_base import Base, EntityList, Pagination, parse_timestamp
from .models_taskgroup import TaskGroup

__all__ = [
    "Base", "EntityList", "Pagination", "parse_timestamp", "TaskGroup",
    "Project", "ProjectCreateResult", "Recurrence", "Task",
    "KanbanStatus", "KanbanTaskStatus", "Habit", "HabitDailyProgress",
    "ChecklistItem", "Tag", "TimeStat",
    "BatchOperation", "BatchOperationResult", "BatchResult",
]

# --------------------------------------------------------------------------- #
# Project
# --------------------------------------------------------------------------- #


@dataclass
class Project(Base):
    id: Optional[str] = None
    title: Optional[str] = None
    note: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    deleteDate: Optional[str] = None
    showInBasket: Optional[bool] = None
    emoji: Optional[str] = None
    color: Optional[str] = None
    externalId: Optional[str] = None
    modificatedDate: Optional[str] = None
    reviewValidationDate: Optional[str] = None
    reviewValidationInterval: Optional[int] = None
    parent: Optional[str] = None
    parentOrder: Optional[float] = None
    journalDate: Optional[str] = None
    sharedState: Optional[Dict[str, Any]] = None
    isNotebook: Optional[bool] = None
    tags: Optional[List[str]] = None
    modificated: Optional[Dict[str, Any]] = None

    @property
    def is_archived(self) -> bool:
        """A project is archived when it carries a ``journalDate``."""
        return bool(self.journalDate)

    @property
    def is_removed(self) -> bool:
        """A project is removed (in basket) when it carries a ``deleteDate``."""
        return bool(self.deleteDate)


@dataclass
class ProjectCreateResult(Base):
    """Response of ``POST /v2/project``: the project plus its default task group."""

    project: Optional[Project] = None
    taskGroup: Optional["TaskGroup"] = None

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "ProjectCreateResult":
        from .models_taskgroup import TaskGroup  # local import to avoid cycle

        return cls(
            project=Project.from_dict(data.get("project")) if data.get("project") else None,
            taskGroup=TaskGroup.from_dict(data.get("taskGroup")) if data.get("taskGroup") else None,
            _extra={k: v for k, v in data.items() if k not in ("project", "taskGroup")},
        )


# --------------------------------------------------------------------------- #
# Task
# --------------------------------------------------------------------------- #

@dataclass
class Recurrence(Base):
    """Recurrence descriptor attached to recurring tasks (server-defined shape)."""

    type: Optional[int] = None
    period: Optional[float] = None
    daysOfWeek: Optional[List[int]] = None
    dayOfMonth: Optional[int] = None
    interval: Optional[float] = None
    until: Optional[str] = None


@dataclass
class Task(Base):
    id: Optional[str] = None
    externalId: Optional[str] = None
    title: Optional[str] = None
    note: Optional[str] = None
    priority: Optional[int] = None
    recurrence: Optional[Dict[str, Any]] = None
    journalDate: Optional[str] = None
    complete: Optional[int] = None
    completeLast: Optional[str] = None
    state: Optional[int] = None
    checked: Optional[int] = None
    showInBasket: Optional[bool] = None
    deleteDate: Optional[str] = None
    projectId: Optional[str] = None
    recurrenceGeneratorId: Optional[str] = None
    start: Optional[str] = None
    startNotifyReaded: Optional[bool] = None
    notify: Optional[int] = None
    startNotifiesReaded: Optional[List[int]] = None
    notifies: Optional[List[int]] = None
    useTime: Optional[bool] = None
    crypted: Optional[str] = None
    deferred: Optional[bool] = None
    deadline: Optional[str] = None
    deadlineNotifyReaded: Optional[bool] = None
    parent: Optional[str] = None
    group: Optional[str] = None
    createdDate: Optional[str] = None
    modificatedDate: Optional[str] = None
    scheduleOrder: Optional[float] = None
    parentOrder: Optional[float] = None
    integrationItemId: Optional[str] = None
    seenToday: Optional[str] = None
    timeLength: Optional[float] = None
    pomodoroCount: Optional[float] = None
    pomodoroTotalTime: Optional[float] = None
    alarmNotify: Optional[bool] = None
    isNote: Optional[bool] = None
    tags: Optional[List[str]] = None
    removed: Optional[bool] = None
    modificated: Optional[Dict[str, Any]] = None

    @property
    def is_completed(self) -> bool:
        return self.checked == 1

    @property
    def is_cancelled(self) -> bool:
        return self.checked == 2

    @property
    def is_archived(self) -> bool:
        return bool(self.journalDate)

    @property
    def is_removed(self) -> bool:
        return bool(self.removed) or bool(self.deleteDate)

    @property
    def start_datetime(self) -> Optional[_dt.datetime]:
        return parse_timestamp(self.start)

    @property
    def deadline_datetime(self) -> Optional[_dt.datetime]:
        return parse_timestamp(self.deadline)


# --------------------------------------------------------------------------- #
# Kanban
# --------------------------------------------------------------------------- #


@dataclass
class KanbanStatus(Base):
    id: Optional[str] = None
    modificatedDate: Optional[str] = None
    removed: Optional[bool] = None
    name: Optional[str] = None
    projectId: Optional[str] = None
    kanbanOrder: Optional[float] = None
    numberOfColumns: Optional[float] = None
    externalId: Optional[str] = None
    modificated: Optional[Dict[str, Any]] = None


@dataclass
class KanbanTaskStatus(Base):
    id: Optional[str] = None
    modificatedDate: Optional[str] = None
    removed: Optional[bool] = None
    taskId: Optional[str] = None
    statusId: Optional[str] = None
    kanbanOrder: Optional[float] = None
    externalId: Optional[str] = None
    modificated: Optional[Dict[str, Any]] = None


# --------------------------------------------------------------------------- #
# Habit
# --------------------------------------------------------------------------- #


@dataclass
class Habit(Base):
    id: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    order: Optional[float] = None
    status: Optional[int] = None
    modificatedDate: Optional[str] = None
    modificated: Optional[Dict[str, Any]] = None
    removed: Optional[bool] = None
    externalId: Optional[str] = None

    @property
    def is_active(self) -> bool:
        return self.status == 0

    @property
    def is_archived(self) -> bool:
        return self.status == 2


@dataclass
class HabitDailyProgress(Base):
    id: Optional[str] = None
    habit: Optional[str] = None
    date: Optional[str] = None
    progress: Optional[int] = None
    modificatedDate: Optional[str] = None
    modificated: Optional[Dict[str, Any]] = None
    removed: Optional[bool] = None
    externalId: Optional[str] = None


# --------------------------------------------------------------------------- #
# Checklist item
# --------------------------------------------------------------------------- #


@dataclass
class ChecklistItem(Base):
    id: Optional[str] = None
    modificatedDate: Optional[str] = None
    removed: Optional[bool] = None
    parent: Optional[str] = None
    parentOrder: Optional[float] = None
    title: Optional[str] = None
    done: Optional[bool] = None
    crypted: Optional[str] = None
    modificated: Optional[Dict[str, Any]] = None


# --------------------------------------------------------------------------- #
# Tag
# --------------------------------------------------------------------------- #


@dataclass
class Tag(Base):
    id: Optional[str] = None
    title: Optional[str] = None
    externalId: Optional[str] = None
    hotkey: Optional[int] = None
    parent: Optional[str] = None
    parentOrder: Optional[float] = None
    modificatedDate: Optional[str] = None
    removed: Optional[bool] = None
    color: Optional[str] = None
    modificated: Optional[Dict[str, Any]] = None


# --------------------------------------------------------------------------- #
# Time stat
# --------------------------------------------------------------------------- #


@dataclass
class TimeStat(Base):
    id: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    secondsPassed: Optional[float] = None
    quantity: Optional[float] = None
    relatedTaskId: Optional[str] = None
    outdated: Optional[bool] = None
    source: Optional[int] = None
    modificatedDate: Optional[str] = None
    removed: Optional[bool] = None

    @property
    def duration(self) -> _dt.timedelta:
        """Duration as a ``timedelta`` (zero when unset)."""
        return _dt.timedelta(seconds=int(self.secondsPassed or 0))


# --------------------------------------------------------------------------- #
# Batch
# --------------------------------------------------------------------------- #


@dataclass
class BatchOperation(Base):
    """One operation inside ``POST /v2/batch``.

    * ``method`` -- POST / PATCH / DELETE
    * ``path``   -- REST path starting with ``/v2/`` (e.g. ``/v2/task``)
    * ``body``   -- JSON body for the operation (validated by target endpoint)
    * ``uuid``   -- client-side id used to correlate the result
    * ``tempId`` -- placeholder id other operations can reference; after the
      batch executes, the real id is available via ``tempIdMap``.
    """

    method: str = "POST"
    path: str = ""
    body: Optional[Dict[str, Any]] = None
    uuid: Optional[str] = None
    tempId: Optional[str] = None

    def to_dict(self, drop_none: bool = True) -> Dict[str, Any]:
        data = {"method": str(getattr(self.method, "value", self.method)), "path": self.path}
        if self.body is not None or not drop_none:
            data["body"] = self.body
        if self.uuid is not None or not drop_none:
            data["uuid"] = self.uuid
        if self.tempId is not None or not drop_none:
            data["tempId"] = self.tempId
        return data


@dataclass
class BatchOperationResult(Base):
    uuid: Optional[str] = None
    status: Optional[int] = None
    body: Optional[Dict[str, Any]] = None

    @property
    def ok(self) -> bool:
        return self.status is not None and 200 <= self.status < 300


@dataclass
class BatchResult(Base):
    """Parsed response of ``POST /v2/batch``."""

    results: List[BatchOperationResult] = field(default_factory=list)
    temp_id_map: Dict[str, str] = field(default_factory=dict)

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "BatchResult":
        return cls(
            results=[BatchOperationResult.from_dict(r) for r in (data.get("results") or [])],
            temp_id_map=dict(data.get("tempIdMap") or {}),
            _extra={k: v for k, v in data.items() if k not in ("results", "tempIdMap")},
        )

    @property
    def all_ok(self) -> bool:
        return all(r.ok for r in self.results)

    def by_uuid(self, uuid: str) -> Optional[BatchOperationResult]:
        for r in self.results:
            if r.uuid == uuid:
                return r
        return None

    def errors(self) -> List[BatchOperationResult]:
        return [r for r in self.results if not r.ok]
