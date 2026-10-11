"""Checklist items, tags and time stats resources.

* checklist items (``C-...``) are sub-items of a task (``parent`` = ``T-...``)
  with dedicated ``check``/``uncheck`` endpoints;
* tags (``A-...``) form a tree (``parent``), can carry a hex ``color`` and an
  ASCII ``hotkey`` (65-90 excluding 84);
* time stats (``TS-...``) record spent time; bulk delete by date range is
  supported.
"""

from __future__ import annotations

from typing import Any, Dict, Iterable, Optional

from ..filters import clean, to_iso_utc
from ..models import ChecklistItem, EntityList, Tag, TimeStat
from .base import Resource


class ChecklistItemsResource(Resource):
    """Accessed as ``client.checklist_items``."""

    collection_key = "checklistItems"
    model = ChecklistItem

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/checklist-item`` -- list items.

        Params: ``parent`` (task id filter, also ``parent.in`` / ``parent.isSet``),
        ``includeRemoved``, standard pagination keys.
        """
        return self._list("/v2/checklist-item", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[ChecklistItem]:
        """GET ``/v2/checklist-item/{id}`` -- fetch one item."""
        return self._get(f"/v2/checklist-item/{id}", params=clean({"fields": fields}))

    def create(self, parent_task_id: str, title: str, **fields: Any) -> ChecklistItem:
        """POST ``/v2/checklist-item`` -- add an item to task ``parent_task_id``.

        Args:
            parent_task_id: required owning task (``T-...``).
            title: required item text.
            **fields: ``done`` (bool), ``parentOrder`` (number), ``crypted``.
        """
        body = clean({"parent": parent_task_id, "title": title, **fields})
        return self._post("/v2/checklist-item", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> ChecklistItem:
        """PATCH ``/v2/checklist-item/{id}`` -- partial update."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/checklist-item/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/checklist-item/{id}`` -- remove item (HTTP 204)."""
        self._t.delete(f"/v2/checklist-item/{id}")

    def check(self, id: str) -> ChecklistItem:
        """POST ``/v2/checklist-item/{id}/check`` -- mark item done."""
        return self._post(f"/v2/checklist-item/{id}/check", {})  # type: ignore[return-value]

    def uncheck(self, id: str) -> ChecklistItem:
        """POST ``/v2/checklist-item/{id}/uncheck`` -- mark item not done."""
        return self._post(f"/v2/checklist-item/{id}/uncheck", {})  # type: ignore[return-value]


class TagsResource(Resource):
    """Accessed as ``client.tags``."""

    collection_key = "tags"
    model = Tag

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/tag`` -- list tags.

        Params: ``parent`` (``A-...`` filter, also ``parent.in`` etc.),
        ``includeRemoved``, standard pagination keys.
        """
        return self._list("/v2/tag", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[Tag]:
        """GET ``/v2/tag/{id}`` -- fetch one tag."""
        return self._get(f"/v2/tag/{id}", params=clean({"fields": fields}))

    def create(self, title: str, **fields: Any) -> Tag:
        """POST ``/v2/tag`` -- create a tag.

        Args:
            title: required tag name.
            **fields: ``hotkey`` (int 65-90, excluding 84/T), ``parent``
                (``A-...`` parent tag for nesting), ``parentOrder``,
                ``color`` (hex string like ``#FF0000``).
        """
        body = clean({"title": title, **fields})
        return self._post("/v2/tag", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> Tag:
        """PATCH ``/v2/tag/{id}`` -- partial update."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/tag/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/tag/{id}`` -- remove tag (HTTP 204)."""
        self._t.delete(f"/v2/tag/{id}")


class TimeStatsResource(Resource):
    """Accessed as ``client.time_stats``."""

    collection_key = "timeStats"
    model = TimeStat

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/time-stat`` -- list time-tracking records.

        Params: ``date`` (+ ``date.gte``/``date.lte``), ``dateFrom``/``dateTo``
        range shortcuts, ``relatedTaskId`` (or ``relatedTaskId.in``),
        standard pagination keys.
        """
        return self._list("/v2/time-stat", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[TimeStat]:
        """GET ``/v2/time-stat/{id}`` -- fetch one record."""
        return self._get(f"/v2/time-stat/{id}", params=clean({"fields": fields}))

    def create(self, start: Any, seconds_passed: float, **fields: Any) -> TimeStat:
        """POST ``/v2/time-stat`` -- record spent time.

        Args:
            start: ISO datetime/date or ``datetime`` object (start of session).
            seconds_passed: duration in seconds.  Limits depend on ``source``:
                POMODORO (0) ≤ 7200 s, STOPWATCH (1, default) ≤ 86400 s.
            **fields: ``relatedTaskId`` (``T-...``), ``source`` (int or
                :class:`~singularity_client.enums.TimeStatSource`).
        """
        body = clean({"start": to_iso_utc(start), "secondsPassed": seconds_passed, **fields})
        return self._post("/v2/time-stat", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> TimeStat:
        """PATCH ``/v2/time-stat/{id}`` -- modify a record."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/time-stat/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/time-stat/{id}`` -- remove one record (HTTP 204)."""
        self._t.delete(f"/v2/time-stat/{id}")

    def delete_bulk(self, date_from: Optional[Any] = None, date_to: Optional[Any] = None,
                    related_task_id: Optional[str] = None) -> int:
        """DELETE ``/v2/time-stat`` -- bulk delete by filters.

        Returns the number of deleted records (``deletedCount``).  Omit all
        filters only if you really mean it: the endpoint then deletes *all*
        matching stats.
        """
        params = clean({"dateFrom": to_iso_utc(date_from), "dateTo": to_iso_utc(date_to),
                        "relatedTaskId": related_task_id})
        data = self._t.delete("/v2/time-stat", params=params or None) or {}
        return int(data.get("deletedCount", 0))
