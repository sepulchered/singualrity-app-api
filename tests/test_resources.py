"""Contract tests for every resource group: URL, verb, params, body, parsing."""

from __future__ import annotations

import datetime as dt

import pytest

from singularity_client import Priority, TaskState


# --------------------------------------------------------------------------- #
# Projects
# --------------------------------------------------------------------------- #

class TestProjects:
    def test_list_parses_collection_and_pagination(self, client, api):
        api.stub("GET", "/v2/project", json_body={
            "projects": [{"id": "P-1", "title": "Alpha", "journalDate": None},
                         {"id": "P-2", "title": "Beta", "journalDate": "1700000000000"}],
            "pagination": {"total": 2, "count": 2, "offset": 0},
        })
        result = client.projects.list(params={"includeArchived": True,
                                              "paginationData": True, "maxCount": 50})
        assert [p.id for p in result] == ["P-1", "P-2"]
        assert result.pagination.total == 2
        assert result[1].is_archived is True
        q = api.last_request()["query"]
        assert "includeArchived=true" in q and "maxCount=50" in q

    def test_get_sends_include_removed_and_fields(self, client, api):
        api.stub("GET", "/v2/project/P-9", json_body={"id": "P-9", "title": "X"})
        p = client.projects.get("P-9", include_removed=True, fields="id,title")
        assert p.title == "X"
        rec = api.last_request()
        assert rec["path"] == "/v2/project/P-9"
        assert "includeRemoved=true" in rec["query"] and "fields=id%2Ctitle" in rec["query"]

    def test_create_returns_project_and_default_group(self, client, api):
        api.stub("POST", "/v2/project", status=201, json_body={
            "project": {"id": "P-1", "title": "New"},
            "taskGroup": {"id": "Q-1", "parent": "P-1", "title": ""},
        })
        res = client.projects.create("New", color="#FF0000", priority=None)
        assert res.project.id == "P-1"
        assert res.taskGroup.id == "Q-1"
        body = api.last_request()["json"]
        assert body == {"title": "New", "color": "#FF0000"}   # None dropped

    def test_update_requires_fields_and_patches(self, client, api):
        api.stub("PATCH", "/v2/project/P-1", json_body={"id": "P-1", "title": "Renamed"})
        p = client.projects.update("P-1", title="Renamed")
        assert p.title == "Renamed"
        rec = api.last_request()
        assert rec["method"] == "PATCH" and rec["json"] == {"title": "Renamed"}
        with pytest.raises(ValueError):
            client.projects.update("P-1")

    def test_delete_is_204_no_content(self, client, api):
        api.stub("DELETE", "/v2/project/P-1", status=204, raw_body=None)
        assert client.projects.delete("P-1") is None
        assert api.last_request()["method"] == "DELETE"

    def test_archive_and_unarchive_paths(self, client, api):
        api.stub("POST", "/v2/project/P-1/archive", json_body={"id": "P-1"})
        client.projects.archive("P-1", journal_date="2026-01-01T00:00:00.000Z")
        assert api.last_request()["json"] == {"journalDate": "2026-01-01T00:00:00.000Z"}
        api.stub("POST", "/v2/project/P-1/unarchive", json_body={"id": "P-1"})
        client.projects.unarchive("P-1")
        assert api.last_request()["path"] == "/v2/project/P-1/unarchive"


# --------------------------------------------------------------------------- #
# Tasks
# --------------------------------------------------------------------------- #

class TestTasks:
    def test_list_with_filters(self, client, api):
        from singularity_client.filters import f, filters

        api.stub("GET", "/v2/task", json_body={"tasks": [{"id": "T-1", "title": "A"}]})
        result = client.tasks.list(params=filters(
            f("start", "gte", dt.datetime(2026, 7, 1, tzinfo=dt.timezone.utc)),
            f("projectId", "in", ["P-1", "P-2"]),
            checked=0, maxCount=10))
        assert result[0].id == "T-1"
        q = api.last_request()["query"]
        assert "start.gte=2026-07-01T00%3A00%3A00.000Z" in q
        assert "projectId.in=P-1%2CP-2" in q
        assert "checked=0" in q and "maxCount=10" in q

    def test_create_serializes_enums_and_drops_none(self, client, api):
        api.stub("POST", "/v2/task", status=201,
                 json_body={"id": "T-9", "title": "Write", "priority": 0})
        t = client.tasks.create("Write", projectId="P-1", priority=Priority.HIGH,
                                note=None, tags=["A-1", "A-2"], state=TaskState.PINNED)
        assert t.id == "T-9"
        body = api.last_request()["json"]
        assert body == {"title": "Write", "projectId": "P-1", "priority": 0,
                        "tags": ["A-1", "A-2"], "state": 0}

    def test_lifecycle_actions_post_empty_body(self, client, api):
        for action in ("complete", "uncomplete", "cancel", "complete-today",
                       "unarchive"):
            api.stub("POST", f"/v2/task/T-1/{action}", json_body={"id": "T-1"})
            getattr(client.tasks, action.replace("-", "_"))("T-1")
            rec = api.last_request()
            assert rec["method"] == "POST"
            assert rec["path"] == f"/v2/task/T-1/{action}"
            assert rec["json"] == {}

    def test_move_body(self, client, api):
        api.stub("POST", "/v2/task/T-1/move", json_body={"id": "T-1", "projectId": "P-2"})
        client.tasks.move("T-1", project_id="P-2", group_id="Q-3")
        assert api.last_request()["json"] == {"projectId": "P-2", "groupId": "Q-3"}

    def test_change_column_body(self, client, api):
        api.stub("POST", "/v2/task/T-1/change-column", json_body={"id": "T-1"})
        client.tasks.change_column("T-1", "KS-2")
        assert api.last_request()["json"] == {"statusId": "KS-2"}

    def test_task_properties(self, client, api):
        api.stub("GET", "/v2/task/T-1", json_body={
            "id": "T-1", "checked": 1, "removed": False,
            "deadline": "1750000000000"})
        t = client.tasks.get("T-1")
        assert t.is_completed and not t.is_cancelled and not t.is_removed
        assert t.deadline_datetime.year == 2025  # epoch ms parsed to UTC datetime

    def test_find_by_external_id_scans(self, client, api):
        api.stub("GET", "/v2/task", json_body={"tasks": [
            {"id": "T-1", "externalId": "erp-7"}, {"id": "T-2", "externalId": "x"}]})
        found = client.tasks.find_by_external_id("erp-7")
        assert [t.id for t in found] == ["T-1"]
        assert "maxCount=1000" in api.last_request()["query"]


# --------------------------------------------------------------------------- #
# Task groups / kanban / habits / checklist / tags / time stats
# --------------------------------------------------------------------------- #

class TestTaskGroups:
    def test_create_path_and_body(self, client, api):
        api.stub("POST", "/v2/task-group", json_body={"id": "Q-1"})
        client.task_groups.create("Backlog", parent="P-1", fake=False)
        rec = api.last_request()
        assert rec["path"] == "/v2/task-group"
        assert rec["json"] == {"title": "Backlog", "parent": "P-1", "fake": False}

    def test_list_collection_key(self, client, api):
        api.stub("GET", "/v2/task-group", json_body={"taskGroups": [{"id": "Q-1"}]})
        assert client.task_groups.list()[0].id == "Q-1"


class TestKanban:
    def test_status_crud(self, client, api):
        api.stub("GET", "/v2/kanban-status", json_body={"kanbanStatuses": [{"id": "KS-1"}]})
        assert client.kanban_statuses.list()[0].id == "KS-1"
        api.stub("POST", "/v2/kanban-status", json_body={"id": "KS-2", "name": "Doing"})
        s = client.kanban_statuses.create("Doing", project_id="P-1", numberOfColumns=3)
        assert api.last_request()["json"] == {"name": "Doing", "projectId": "P-1",
                                              "numberOfColumns": 3}

    def test_task_status_link(self, client, api):
        api.stub("POST", "/v2/kanban-task-status", json_body={"id": "KTS-1"})
        client.kanban_task_statuses.create("T-1", "KS-2")
        assert api.last_request()["json"] == {"taskId": "T-1", "statusId": "KS-2"}


class TestHabits:
    def test_create_and_archive(self, client, api):
        api.stub("POST", "/v2/habit", json_body={"id": "HB-1", "status": 0})
        h = client.habits.create("Run", color="green")
        assert h.is_active
        api.stub("PATCH", "/v2/habit/HB-1", json_body={"id": "HB-1", "status": 2})
        archived = client.habits.archive("HB-1")
        assert archived.is_archived
        assert api.last_request()["json"] == {"status": 2}

    def test_progress_mark_full_defaults_today(self, client, api):
        api.stub("POST", "/v2/habit-progress", json_body={"id": "HP-1"})
        client.habit_progress.mark_full("HB-1")
        body = api.last_request()["json"]
        assert body["habit"] == "HB-1" and body["progress"] == 2
        assert body["date"] == dt.date.today().isoformat()

    def test_progress_list_collection_key(self, client, api):
        api.stub("GET", "/v2/habit-progress",
                 json_body={"progressRecords": [{"id": "HP-1", "progress": 2}]})
        records = client.habit_progress.list(params={"habit": "HB-1"})
        assert records[0].progress == 2
        assert "habit=HB-1" in api.last_request()["query"]


class TestChecklistItems:
    def test_check_uncheck_paths(self, client, api):
        api.stub("POST", "/v2/checklist-item/CI-1/check", json_body={"id": "CI-1"})
        client.checklist_items.check("CI-1")
        assert api.last_request()["path"] == "/v2/checklist-item/CI-1/check"
        api.stub("POST", "/v2/checklist-item/CI-1/uncheck", json_body={"id": "CI-1"})
        client.checklist_items.uncheck("CI-1")
        assert api.last_request()["path"] == "/v2/checklist-item/CI-1/uncheck"

    def test_create(self, client, api):
        api.stub("POST", "/v2/checklist-item", json_body={"id": "CI-2"})
        client.checklist_items.create("T-1", "Buy milk")
        assert api.last_request()["json"] == {"parent": "T-1", "title": "Buy milk"}


class TestTags:
    def test_crud(self, client, api):
        api.stub("GET", "/v2/tag", json_body={"tags": [{"id": "A-1", "title": "urgent"}]})
        assert client.tags.list()[0].title == "urgent"
        api.stub("POST", "/v2/tag", json_body={"id": "A-2"})
        client.tags.create("someday", hotkey=76, color="#00FF00")
        assert api.last_request()["json"] == {"title": "someday", "hotkey": 76,
                                              "color": "#00FF00"}


class TestTimeStats:
    def test_create_converts_datetime(self, client, api):
        api.stub("POST", "/v2/time-stat", json_body={"id": "TS-1"})
        start = dt.datetime(2026, 10, 5, 9, 30, tzinfo=dt.timezone.utc)
        client.time_stats.create(start, 1500, relatedTaskId="T-1", source=0)
        body = api.last_request()["json"]
        assert body["start"].startswith("2026-10-05T09:30:00")
        assert body["secondsPassed"] == 1500 and body["source"] == 0

    def test_duration_property(self, client, api):
        api.stub("GET", "/v2/time-stat/TS-1", json_body={"id": "TS-1", "secondsPassed": 90})
        ts = client.time_stats.get("TS-1")
        assert ts.duration == dt.timedelta(seconds=90)

    def test_delete_bulk_returns_count(self, client, api):
        api.stub("DELETE", "/v2/time-stat", json_body={"deletedCount": 12})
        n = client.time_stats.delete_bulk(date_from="2026-01-01", date_to="2026-02-01")
        assert n == 12
        q = api.last_request()["query"]
        assert "dateFrom=2026-01-01" in q and "dateTo=2026-02-01" in q


# --------------------------------------------------------------------------- #
# Batch
# --------------------------------------------------------------------------- #

class TestBatch:
    def test_op_validation(self, client):
        b = client.batch
        with pytest.raises(ValueError):
            b.op("GET", "/v2/task")
        with pytest.raises(ValueError):
            b.op("POST", "/v1/task")

    def test_execute_fills_uuids_and_parses_result(self, client, api):
        api.stub("POST", "/v2/batch", json_body={
            "results": [
                {"uuid": "u1", "status": 201, "body": {"id": "P-1"}},
                {"uuid": "u2", "status": 400, "body": {"message": "bad"}},
            ],
            "tempIdMap": {"proj": "P-1"},
        })
        op1 = b = client.batch.op("POST", "/v2/project", {"title": "X"},
                                  uuid="u1", temp_id="proj")
        op2 = client.batch.op("POST", "/v2/task", {"title": "Y", "projectId": "proj"},
                              uuid="u2")
        result = client.batch.execute([op1, op2])
        assert result.all_ok is False
        assert len(result.errors()) == 1
        assert result.by_uuid("u1").ok
        assert result.temp_id_map["proj"] == "P-1"
        sent = api.last_request()["json"]
        assert sent["operations"][0]["tempId"] == "proj"
        assert sent["operations"][1]["body"]["projectId"] == "proj"

    def test_execute_accepts_plain_dicts_and_autouuid(self, client, api):
        api.stub("POST", "/v2/batch", json_body={"results": [], "tempIdMap": {}})
        client.batch.execute([{"method": "DELETE", "path": "/v2/task/T-1"}])
        op = api.last_request()["json"]["operations"][0]
        assert len(op["uuid"]) == 36  # generated uuid4
