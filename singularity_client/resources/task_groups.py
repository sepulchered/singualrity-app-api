"""Task groups resource -- ``/v2/task-group`` endpoints.

Task groups (ids ``Q-...``) live inside a project (``parent`` = ``P-...``) and
group tasks within it.  Every created project gets one default group.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from ..filters import clean
from ..models import EntityList, TaskGroup
from .base import Resource


class TaskGroupsResource(Resource):
    """Accessed as ``client.task_groups``."""

    collection_key = "taskGroups"
    model = TaskGroup

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/task-group`` -- list task groups.

        Useful params: ``parent`` (project id filter), ``parent.in``,
        ``includeRemoved``, ``maxCount``, ``offset``, ``modifiedSince``,
        ``paginationData``.
        """
        return self._list("/v2/task-group", params=params)

    def get(self, id: str, include_removed: Optional[bool] = None,
            fields: Optional[str] = None) -> Optional[TaskGroup]:
        """GET ``/v2/task-group/{id}`` -- fetch one group by ID (``Q-...``)."""
        params = {"includeRemoved": None if include_removed is None else str(include_removed).lower(),
                  "fields": fields}
        return self._get(f"/v2/task-group/{id}", params=clean(params))

    def create(self, title: str, parent: str, **fields: Any) -> TaskGroup:
        """POST ``/v2/task-group`` -- create a group inside project ``parent``.

        Args:
            title: required (must be empty when ``fake=True``).
            parent: required project id (``P-...``).
            **fields: ``externalId``, ``parentOrder``, ``fake``.
        """
        body = clean({"title": title, "parent": parent, **fields})
        return self._post("/v2/task-group", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> TaskGroup:
        """PATCH ``/v2/task-group/{id}`` -- partial update of a group."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/task-group/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/task-group/{id}`` -- remove a group (HTTP 204)."""
        self._t.delete(f"/v2/task-group/{id}")
