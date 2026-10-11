"""Tasks resource -- ``/v2/task`` endpoints.

Tasks (ids ``T-...``) are the core entity.  They belong to a project
(``projectId``), optionally to a task group (``group`` = ``Q-...``) and can be
nested via ``parent``.  Lifecycle actions are dedicated POST sub-resources:
``complete``, ``uncomplete``, ``cancel``, ``complete-today``, ``archive``,
``unarchive``, ``move``, ``change-column``.
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, List, Optional, Union

from ..filters import clean, join_ids
from ..models import EntityList, Task
from .base import Resource


class TasksResource(Resource):
    """Accessed as ``client.tasks``."""

    collection_key = "tasks"
    model = Task

    # ------------------------------------------------------------------ #
    # CRUD
    # ------------------------------------------------------------------ #

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/task`` -- list/filter tasks.

        Common params (all optional): ``maxCount`` (1-1000), ``offset``,
        ``modifiedSince``, ``paginationData``, ``includeRemoved``,
        ``includeArchived``, ``includeAllRecurrenceInstances``, ``projectId``,
        ``parent``, ``group``, ``start``, ``deadline``, ``journalDate``,
        ``deleteDate``, ``checked``, ``priority``, ``state``, ``isNote``,
        ``deferred``, ``tags`` (comma separated ids), plus rich filters like
        ``start.gte`` / ``deadline.lt`` / ``projectId.in`` / ``checked.isSet``.

        ⚠️ Pagination caveat from the spec: with recurring tasks and
        ``includeAllRecurrenceInstances=false`` (default) the returned ``count``
        may be smaller than ``maxCount`` and offsets may show gaps.  Pass
        ``includeAllRecurrenceInstances=True`` for reliable offset pagination.
        """
        return self._list("/v2/task", params=params)

    def get(self, id: str, include_removed: Optional[bool] = None,
            fields: Optional[str] = None) -> Optional[Task]:
        """GET ``/v2/task/{id}`` -- fetch one task by ID."""
        params = {"includeRemoved": None if include_removed is None else str(include_removed).lower(),
                  "fields": fields}
        return self._get(f"/v2/task/{id}", params=clean(params))

    def create(self, title: str, **fields: Any) -> Task:
        """POST ``/v2/task`` -- create a task.

        Args:
            title: required task title.
            **fields: any ``TaskCreateDto`` field, notably ``projectId``
                (``P-...``), ``group`` (``Q-...``), ``parent`` (``T-...``),
                ``note`` (delta format), ``priority`` (int or
                :class:`~singularity_client.enums.Priority`), ``start``,
                ``deadline``, ``timeLength`` (minutes), ``notifies``
                (list of minutes-before-start reminders), ``alarmNotify``,
                ``checked``, ``state``, ``complete`` (0-999), ``tags``
                (list of ``A-...`` ids), ``externalId``, ``isNote``,
                ``deferred``, ``useTime``, ``showInBasket``, ``deleteDate``,
                ``journalDate``.
        """
        body = clean({"title": title, **fields})
        if isinstance(body.get("tags"), (list, tuple)):
            body["tags"] = list(body["tags"])
        return self._post("/v2/task", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> Task:
        """PATCH ``/v2/task/{id}`` -- partial update; only sent fields change."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/task/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/task/{id}`` -- move task to basket (HTTP 204)."""
        self._t.delete(f"/v2/task/{id}")

    # ------------------------------------------------------------------ #
    # lifecycle actions (no body)
    # ------------------------------------------------------------------ #

    def complete(self, id: str) -> Task:
        """POST ``/v2/task/{id}/complete`` -- mark a (recurring) task done."""
        return self._post(f"/v2/task/{id}/complete", {})  # type: ignore[return-value]

    def uncomplete(self, id: str) -> Task:
        """POST ``/v2/task/{id}/uncomplete`` -- undo completion."""
        return self._post(f"/v2/task/{id}/uncomplete", {})  # type: ignore[return-value]

    def cancel(self, id: str) -> Task:
        """POST ``/v2/task/{id}/cancel`` -- cancel the task (``checked=2``)."""
        return self._post(f"/v2/task/{id}/cancel", {})  # type: ignore[return-value]

    def complete_today(self, id: str) -> Task:
        """POST ``/v2/task/{id}/complete-today`` -- complete for *today* instance."""
        return self._post(f"/v2/task/{id}/complete-today", {})  # type: ignore[return-value]

    def archive(self, id: str, journal_date: Optional[str] = None) -> Task:
        """POST ``/v2/task/{id}/archive`` -- archive into the journal."""
        body = clean({"journalDate": journal_date})
        return self._post(f"/v2/task/{id}/archive", body or {})  # type: ignore[return-value]

    def unarchive(self, id: str) -> Task:
        """POST ``/v2/task/{id}/unarchive`` -- restore from archive."""
        return self._post(f"/v2/task/{id}/unarchive", {})  # type: ignore[return-value]

    # ------------------------------------------------------------------ #
    # relocation
    # ------------------------------------------------------------------ #

    def move(self, id: str, project_id: str, group_id: Optional[str] = None,
             parent: Optional[str] = None) -> Task:
        """POST ``/v2/task/{id}/move`` -- move task to another project/group/parent.

        Args:
            project_id: required destination project (``P-...``).
            group_id: optional destination task group (``Q-...``).
            parent: optional new parent task (``T-...``).
        """
        body = clean({"projectId": project_id, "groupId": group_id, "parent": parent})
        return self._post(f"/v2/task/{id}/move", body)  # type: ignore[return-value]

    def change_column(self, id: str, status_id: str) -> Task:
        """POST ``/v2/task/{id}/change-column`` -- move task in kanban board.

        Args:
            status_id: kanban status id (``KS-...``).
        """
        body = {"statusId": status_id}
        return self._post(f"/v2/task/{id}/change-column", body)  # type: ignore[return-value]

    # ------------------------------------------------------------------ #
    # convenience helpers
    # ------------------------------------------------------------------ #

    def list_by_project(self, project_id: str, **params: Any) -> EntityList:
        """All tasks of a project (shorthand for ``list(params={"projectId": ...})``)."""
        return self.list(params={"projectId": project_id, **params})

    def find_by_external_id(self, external_id: str) -> List[Task]:
        """Return tasks whose ``externalId`` equals *external_id*.

        Implemented client-side over an unfiltered listing; use sparingly on
        large accounts (the API has no ``externalId`` filter).
        """
        result = self.list(params={"maxCount": 1000})
        return [t for t in result.items if getattr(t, "externalId", None) == external_id]
