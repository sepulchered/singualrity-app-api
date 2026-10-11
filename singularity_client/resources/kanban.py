"""Kanban resources -- ``/v2/kanban-status`` and ``/v2/kanban-task-status``.

A *kanban status* (``KS-...``) is a board column belonging to a project; a
*kanban task status* link (``KTS-...``) pins a task (``T-...``) into a column.
To move a task between columns you can either use the dedicated endpoint
``client.tasks.change_column(...)`` or manage these links directly.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from ..filters import clean
from ..models import EntityList, KanbanStatus, KanbanTaskStatus
from .base import Resource


class KanbanStatusesResource(Resource):
    """Accessed as ``client.kanban_statuses``."""

    collection_key = "kanbanStatuses"
    model = KanbanStatus

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/kanban-status`` -- list columns.

        Params: ``projectId`` filter (or ``projectId.in``), ``includeRemoved``,
        ``maxCount``, ``offset``, ``modifiedSince``, ``paginationData``.
        """
        return self._list("/v2/kanban-status", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[KanbanStatus]:
        """GET ``/v2/kanban-status/{id}`` -- fetch one column by ID."""
        return self._get(f"/v2/kanban-status/{id}", params=clean({"fields": fields}))

    def create(self, name: str, project_id: str, **fields: Any) -> KanbanStatus:
        """POST ``/v2/kanban-status`` -- create a kanban column in a project.

        Args:
            name: required column name (e.g. "In progress").
            project_id: required owning project (``P-...``).
            **fields: ``externalId``, ``kanbanOrder`` (display order),
                ``numberOfColumns`` (integer 1-100, default 1).
        """
        body = clean({"name": name, "projectId": project_id, **fields})
        return self._post("/v2/kanban-status", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> KanbanStatus:
        """PATCH ``/v2/kanban-status/{id}`` -- rename/reorder a column."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/kanban-status/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/kanban-status/{id}`` -- remove a column (HTTP 204)."""
        self._t.delete(f"/v2/kanban-status/{id}")


class KanbanTaskStatusesResource(Resource):
    """Accessed as ``client.kanban_task_statuses`` -- task↔column links."""

    collection_key = "kanbanTaskStatuses"
    model = KanbanTaskStatus

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/kanban-task-status`` -- list links.

        Params: ``taskId`` / ``statusId`` filters (also ``*.in`` variants),
        ``includeRemoved``, standard pagination keys.
        """
        return self._list("/v2/kanban-task-status", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[KanbanTaskStatus]:
        """GET ``/v2/kanban-task-status/{id}`` -- fetch one link by ID."""
        return self._get(f"/v2/kanban-task-status/{id}", params=clean({"fields": fields}))

    def create(self, task_id: str, status_id: str, **fields: Any) -> KanbanTaskStatus:
        """POST ``/v2/kanban-task-status`` -- attach a task to a column.

        Args:
            task_id: task (``T-...``).
            status_id: kanban status/column (``KS-...``).
            **fields: ``externalId``, ``kanbanOrder``.
        """
        body = clean({"taskId": task_id, "statusId": status_id, **fields})
        return self._post("/v2/kanban-task-status", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> KanbanTaskStatus:
        """PATCH ``/v2/kanban-task-status/{id}`` -- modify a link."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/kanban-task-status/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/kanban-task-status/{id}`` -- detach task from column."""
        self._t.delete(f"/v2/kanban-task-status/{id}")
