"""Model tolerance/round-trip tests and filter-helper unit tests."""

from __future__ import annotations

import datetime as dt

import pytest

from singularity_client import (
    Habit, Priority, Project, Task, parse_timestamp,
)
from singularity_client.exceptions import SingularityConfigurationError
from singularity_client.filters import (
    clean, f, filters, join_ids, split_list, to_iso_utc,
)
from singularity_client.models_base import Base


class TestParseTimestamp:
    def test_epoch_ms_string(self):
        assert parse_timestamp("1633021234567").year == 2021

    def test_epoch_ms_int(self):
        d = parse_timestamp(1633021234567)
        assert d.tzinfo is not None

    def test_iso_with_z(self):
        d = parse_timestamp("2026-07-01T00:00:00.000Z")
        assert d.month == 7 and d.utcoffset().total_seconds() == 0

    def test_naive_assumed_utc(self):
        d = parse_timestamp("2026-07-01T10:00:00")
        assert d.tzinfo == dt.timezone.utc

    def test_empty_and_garbage(self):
        assert parse_timestamp(None) is None
        assert parse_timestamp("") is None
        assert parse_timestamp("not-a-date") is None


class TestTolerance:
    def test_unknown_fields_kept_in_extra(self):
        p = Project.from_dict({"id": "P-1", "title": "X", "brandNewField": {"a": 1}})
        assert p._extra["brandNewField"] == {"a": 1}
        out = p.to_dict()
        assert out["brandNewField"] == {"a": 1} and out["id"] == "P-1"

    def test_missing_optionals_are_none(self):
        t = Task.from_dict({"id": "T-1"})
        assert t.title is None and t.priority is None

    def test_to_dict_drops_none_by_default(self):
        assert Task(id="T-1", title=None).to_dict() == {"id": "T-1"}
        assert "title" in Task(id="T-1", title=None).to_dict(drop_none=False)

    def test_enum_values_serialize(self):
        t = Task(id="T-1", priority=Priority.LOW)
        assert t.to_dict()["priority"] == 2

    def test_from_dict_none_raises(self):
        with pytest.raises(ValueError):
            Habit.from_dict(None)


class TestTaskProperties:
    def test_flags(self):
        t = Task.from_dict({"checked": 2, "journalDate": "1700000000000"})
        assert t.is_cancelled and t.is_archived and not t.is_completed
        assert t.start_datetime is None


class TestFilters:
    def test_f_eq_and_isSet(self):
        assert f("checked", "eq", 0) == {"checked.eq": 0}
        assert f("journalDate", "isSet", 1) == {"journalDate.isSet": True}

    def test_f_in_joins(self):
        assert f("parent", "in", ["P-1", "P-2"]) == {"parent.in": "P-1,P-2"}

    def test_f_bad_op_raises(self):
        with pytest.raises(SingularityConfigurationError):
            f("x", "contains", "y")

    def test_filters_merges_and_drops_none(self):
        out = filters(f("a", "eq", 1), b=2, c=None)
        assert out == {"a.eq": 1, "b": 2}

    def test_to_iso_utc_variants(self):
        assert to_iso_utc(dt.date(2026, 1, 2)) == "2026-01-02"
        assert to_iso_utc("raw-string") == "raw-string"
        assert to_iso_utc(None) is None
        s = to_iso_utc(dt.datetime(2026, 1, 2, 3, 4, 5, 6000))
        assert s == "2026-01-02T03:04:05.006Z"

    def test_clean_deep(self):
        out = clean({"a": None, "b": {"c": None, "d": [None, Priority.HIGH]},
                     "e": dt.date(2026, 5, 1)})
        assert out == {"b": {"d": [0]}, "e": "2026-05-01"}

    def test_join_and_split(self):
        assert join_ids(["A-1", "A-2"]) == "A-1,A-2"
        assert join_ids("already") == "already"
        assert join_ids(None) is None
        assert split_list("a, b,,c") == ["a", "b", "c"]
        assert split_list(["x"]) == ["x"]


class TestEntityList:
    def test_from_response_extras_preserved(self):
        from singularity_client.models import EntityList

        el = EntityList.from_response(
            {"tasks": [{"id": "T-1"}], "serverMeta": {"sync": 1}}, "tasks", Task)
        assert el[0].id == "T-1"
        assert el._extra["serverMeta"] == {"sync": 1}
        # to_dicts() keeps the full shape (drop_none=False) -- id must be present.
        assert all(d["id"] == "T-1" for d in el.to_dicts())
        assert list(el) == el.items
