"""Habits resources -- ``/v2/habit`` and ``/v2/habit-progress``.

A habit (``HB-...``) has a daily progress record per date; progress values are
``0 = EMPTY``, ``1 = SKIP``, ``2 = FULL`` (see
:class:`singularity_client.enums.HabitProgress`).  Via REST, habits can only be
ACTIVE (0) or ARCHIVED (2).
"""

from __future__ import annotations

import datetime as _dt
from typing import Any, Dict, Optional

from ..filters import clean, to_iso_utc
from ..models import EntityList, Habit, HabitDailyProgress
from .base import Resource


class HabitsResource(Resource):
    """Accessed as ``client.habits``."""

    collection_key = "habits"
    model = Habit

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/habit`` -- list habits.

        Params: ``includeArchived``, ``status`` (int filter, also ``status.eq``
        / ``status.in``), standard pagination keys.
        """
        return self._list("/v2/habit", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[Habit]:
        """GET ``/v2/habit/{id}`` -- fetch one habit by ID."""
        return self._get(f"/v2/habit/{id}", params=clean({"fields": fields}))

    def create(self, title: str, **fields: Any) -> Habit:
        """POST ``/v2/habit`` -- create a habit.

        Args:
            title: required habit name.
            **fields: ``description``, ``color`` (one of red/pink/purple/
                deepPurple/indigo/lightBlue/cyan/teal/green/lightGreen/lime/
                yellow/amber/orange/deepOrange/brown/grey/blueGrey),
                ``order``, ``status`` (0 ACTIVE / 2 ARCHIVED via REST),
                ``externalId``.
        """
        body = clean({"title": title, **fields})
        return self._post("/v2/habit", body)  # type: ignore[return-value]

    def update(self, id: str, **fields: Any) -> Habit:
        """PATCH ``/v2/habit/{id}`` -- partial update."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/habit/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/habit/{id}`` -- remove a habit (HTTP 204)."""
        self._t.delete(f"/v2/habit/{id}")

    def archive(self, id: str) -> Habit:
        """Archive a habit (sets ``status=2``) via PATCH."""
        return self.update(id, status=2)

    def unarchive(self, id: str) -> Habit:
        """Re-activate an archived habit (sets ``status=0``) via PATCH."""
        return self.update(id, status=0)


class HabitProgressResource(Resource):
    """Accessed as ``client.habit_progress`` -- daily progress records."""

    collection_key = "progressRecords"
    model = HabitDailyProgress

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/habit-progress`` -- list progress records.

        Params: ``habit`` (``HB-...`` filter, also ``habit.in``), ``date``
        (``YYYY-MM-DD``, supports ``date.gte``/``date.lte``...), plus
        ``startDate``/``endDate`` range shortcuts and standard pagination keys.
        """
        return self._list("/v2/habit-progress", params=params)

    def get(self, id: str, fields: Optional[str] = None) -> Optional[HabitDailyProgress]:
        """GET ``/v2/habit-progress/{id}`` -- fetch one record by ID."""
        return self._get(f"/v2/habit-progress/{id}", params=clean({"fields": fields}))

    def create(self, habit_id: str, date: Any, progress: int, **fields: Any) -> HabitDailyProgress:
        """POST ``/v2/habit-progress`` -- record progress for a day.

        Args:
            habit_id: habit (``HB-...``).
            date: ``YYYY-MM-DD`` string or ``datetime.date``.
            progress: 0 EMPTY / 1 SKIP / 2 FULL (or ``HabitProgress`` enum).
            **fields: ``externalId``.
        """
        body = clean({"habit": habit_id, "date": to_iso_utc(date),
                      "progress": progress, **fields})
        return self._post("/v2/habit-progress", body)  # type: ignore[return-value]

    def mark_full(self, habit_id: str, date: Optional[_dt.date] = None, **fields: Any):
        """Convenience: mark today's (or given date's) progress as FULL (2)."""
        return self.create(habit_id, date or _dt.date.today(), 2, **fields)

    def update(self, id: str, **fields: Any) -> HabitDailyProgress:
        """PATCH ``/v2/habit-progress/{id}`` -- modify a record (requires ``habit``+``date``)."""
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/habit-progress/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/habit-progress/{id}`` -- remove a record (HTTP 204)."""
        self._t.delete(f"/v2/habit-progress/{id}")
