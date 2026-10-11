"""End-to-end integration tests against a local stdlib fake API server.

Unlike the unit tests (which stub individual endpoints), this module drives
the *whole* stack — client → resources → transport → urllib session → real
HTTP socket → threaded fake server — through realistic multi-step workflows:

1. create project → task group → tasks,
2. list with filter query params round-tripping through the wire,
3. lifecycle actions (complete / archive) and state verification,
4. tags + checklist items + time stats,
5. kanban column moves,
6. batch execution,
7. error semantics (typed 404 exception, retry on 500 then success),
8. context-manager usage and the raw escape hatch.

If this file passes, the library works over real HTTP exactly as documented.
"""

from __future__ import annotations

import datetime as dt
import json
import urllib.parse

import pytest

from singularity_client import SingularityClient
from singularity_client.exceptions import SingularityAPIError, SingularityError
from singularity_client.filters import f, filters


def last_request(api):
    return api.last_request()


# --------------------------------------------------------------------------- #
# full workflow
# --------------------------------------------------------------------------- #

class TestEndToEndWorkflow:
    """Scenarios executed step by step; each step asserts both the outgoing
    request (path/body/headers/query) and the parsed response model."""

    def test_project_task_happy_path(self, api, client: SingularityClient):
        # ---- seed canned responses ------------------------------------- #
        project_payload = {
            "project": {"id": "P-1", "title": "Q3 Launch"},
            "taskGroup": {"id": "Q-1", "title": "Q3 Launch", "parent": "P-1"},
        }
        group_payload = {"id": "Q-2", "title": "Marketing", "parent": "P-1"}
        task_payload = {
            "id": "T-1", "title": "Write press release", "checked": 0,
            "group": "Q-2", "projectId": "P-1", "priority": 2,
        }

        api.stub("POST", "/v2/project", status=201, json_body=project_payload)
        api.stub("POST", "/v2/task-group", status=201, json_body=group_payload)
        api.stub("POST", "/v2/task", status=201, json_body=task_payload)

        # ---- create ------------------------------------------------------ #
        result = client.projects.create(title="Q3 Launch")
        req = last_request(api)
        assert req["method"] == "POST"
        assert req["path"] == "/v2/project"
        assert json.loads(req["raw_body"])["title"] == "Q3 Launch"
        assert req["headers"].get("authorization") == "Bearer test-token"
        assert req["headers"].get("content-type") == "application/json"
        assert result.project.id == "P-1"
        assert result.taskGroup.id == "Q-1"

        group = client.task_groups.create(title="Marketing", parent="P-1")
        assert group.parent == "P-1"

        task = client.tasks.create(title="Write press release",
                                   group="Q-2", projectId="P-1", priority=2)
        assert task.id == "T-1"
        assert task.checked == 0
        assert not task.is_completed
        sent = json.loads(last_request(api)["raw_body"])
        assert sent == {"title": "Write press release", "group": "Q-2",
                        "projectId": "P-1", "priority": 2}

        # ---- list with filters (query string must hit the wire) --------- #
        list_payload = {"tasks": [task_payload],
                        "pagination": {"total": 1, "count": 1, "offset": 0}}
        api.stub("GET", "/v2/task", json_body=list_payload)

        result = client.tasks.list(params=filters(
            f("projectId", "in", ["P-1"]),
            checked=0,
            maxCount=50,
            paginationData=True,
        ))
        req = last_request(api)
        qs = urllib.parse.parse_qs(req["query"])
        assert qs["projectId.in"] == ["P-1"]
        assert qs["checked"] == ["0"]
        assert qs["maxCount"] == ["50"]
        assert qs["paginationData"] == ["true"]      # bool normalized on the wire
        assert len(result.items) == 1
        assert result.pagination.total == 1
        assert result.items[0].title == "Write press release"

        # ---- complete & verify via GET ---------------------------------- #
        done_payload = dict(task_payload, checked=1,
                            completeLast="2026-10-11T12:00:00.000Z")
        api.stub("POST", "/v2/task/T-1/complete", json_body=done_payload)
        api.stub("GET", "/v2/task/T-1", json_body=done_payload)

        completed = client.tasks.complete("T-1")
        assert last_request(api)["path"] == "/v2/task/T-1/complete"
        assert completed.is_completed

        fetched = client.tasks.get("T-1")
        assert fetched.completeLast == "2026-10-11T12:00:00.000Z"

        # ---- update (PATCH) ---------------------------------------------- #
        patched = dict(done_payload, title="Press release v2")
        api.stub("PATCH", "/v2/task/T-1", json_body=patched)
        updated = client.tasks.update("T-1", title="Press release v2")
        req = last_request(api)
        assert req["method"] == "PATCH"
        assert json.loads(req["raw_body"]) == {"title": "Press release v2"}
        assert updated.title == "Press release v2"

        # ---- delete ------------------------------------------------------- #
        api.stub("DELETE", "/v2/task/T-1", status=204, raw_body=None)
        client.tasks.delete("T-1")
        assert last_request(api)["method"] == "DELETE"

    def test_archive_roundtrip(self, api, client: SingularityClient):
        archived = {"id": "T-2", "title": "old", "journalDate": "2026-10-01"}
        restored = {"id": "T-2", "title": "old", "journalDate": None}
        api.stub("POST", "/v2/task/T-2/archive", json_body=archived)
        api.stub("POST", "/v2/task/T-2/unarchive", json_body=restored)

        assert client.tasks.archive("T-2").is_archived
        assert not client.tasks.unarchive("T-2").is_archived

    def test_tags_checklist_and_time_stats(self, api, client: SingularityClient):
        tag = {"id": "A-1", "title": "urgent", "color": "#FF0000"}
        item = {"id": "CI-1", "title": "proofread", "done": False, "parent": "T-2"}
        stat = {"id": "TS-1", "start": "2026-10-11T09:00:00.000Z", "secondsPassed": 1800}

        api.stub("POST", "/v2/tag", status=201, json_body=tag)
        api.stub("POST", "/v2/checklist-item", status=201, json_body=item)
        api.stub("POST", "/v2/checklist-item/CI-1/check",
                 json_body=dict(item, done=True))
        api.stub("POST", "/v2/time-stat", status=201, json_body=stat)

        created_tag = client.tags.create(title="urgent", color="#FF0000")
        assert created_tag.id == "A-1"

        client.checklist_items.create(parent_task_id="T-2", title="proofread")
        assert json.loads(last_request(api)["raw_body"])["parent"] == "T-2"

        checked = client.checklist_items.check("CI-1")
        assert last_request(api)["path"] == "/v2/checklist-item/CI-1/check"
        assert getattr(checked, "done", None) is True or \
               getattr(checked, "isChecked", None) is True

        created_stat = client.time_stats.create(
            start=dt.datetime(2026, 10, 11, 9, 0, tzinfo=dt.timezone.utc),
            seconds_passed=1800,
            relatedTaskId="T-2",
        )
        sent = json.loads(last_request(api)["raw_body"])
        assert sent["start"].startswith("2026-10-11T09:00:00")  # ISO on the wire
        assert sent["secondsPassed"] == 1800
        assert created_stat.secondsPassed == 1800

    def test_kanban_move_and_change_column(self, api, client: SingularityClient):
        moved = {"id": "T-3", "title": "Design logo", "projectId": "P-9",
                 "group": "Q-9"}
        api.stub("POST", "/v2/task/T-3/move", json_body=moved)
        api.stub("POST", "/v2/task/T-3/change-column",
                 json_body=dict(moved, statusId="KS-2"))

        r1 = client.tasks.move("T-3", project_id="P-9", group_id="Q-9")
        body = json.loads(last_request(api)["raw_body"])
        assert body["projectId"] == "P-9" and body["groupId"] == "Q-9"
        assert r1.projectId == "P-9"

        client.tasks.change_column("T-3", status_id="KS-2")
        assert json.loads(last_request(api)["raw_body"]) == {"statusId": "KS-2"}

    def test_batch_execute(self, api, client: SingularityClient):
        batch_response = {
            "results": [
                {"uuid": "u-1", "status": 201, "body": {"id": "T-4"}},
                {"uuid": "u-2", "status": 404, "body": {"message": "gone"}},
            ],
            "tempIdMap": {"tmp-1": "T-4"},
        }
        api.stub("POST", "/v2/batch", json_body=batch_response)

        op1 = client.batch.op("POST", "/v2/task", {"title": "a"}, uuid="u-1")
        op2 = client.batch.op("PATCH", "/v2/task/T-5", {"checked": 1}, uuid="u-2")
        result = client.batch.execute([op1, op2])

        req = last_request(api)
        assert req["path"] == "/v2/batch"
        body = json.loads(req["raw_body"])
        assert [o["uuid"] for o in body["operations"]] == ["u-1", "u-2"]
        assert result.all_ok is False
        assert len(result.errors()) == 1
        assert result.by_uuid("u-1").ok
        assert result.temp_id_map == {"tmp-1": "T-4"}

    def test_typed_error_on_404(self, api, client: SingularityClient):
        api.stub("GET", "/v2/task/missing", status=404,
                 json_body={"statusCode": 404, "message": "Task not found"})
        with pytest.raises(SingularityAPIError) as excinfo:
            client.tasks.get("missing")
        assert excinfo.value.status_code == 404
        assert "not found" in str(excinfo.value).lower()

    def test_retry_then_success(self):
        # Own fixtures so we can enable retries on the client.
        from conftest import FakeAPI

        api = FakeAPI()
        client = SingularityClient(token="test-token", base_url=api.base_url,
                                   max_retries=2, backoff_factor=0.01)
        try:
            payload = {"id": "T-9", "title": "flaky", "checked": 0}
            api.stub("GET", "/v2/task/T-9", status=500,
                     json_body={"message": "boom"}, repeat=2)
            api.stub("GET", "/v2/task/T-9", json_body=payload)
            task = client.tasks.get("T-9")
            assert task.id == "T-9"
            get_reqs = [r for r in api.requests
                        if r["method"] == "GET" and r["path"] == "/v2/task/T-9"]
            assert len(get_reqs) == 3   # 2 failures + 1 success
        finally:
            client.close()
            api.stop()

    def test_raw_escape_hatch(self, api, client: SingularityClient):
        api.stub("GET", "/v2/project/P-1", json_body={"id": "P-1", "title": "Raw"})
        data = client.raw("GET", "/v2/project/P-1")
        assert data["title"] == "Raw"
        assert last_request(api)["headers"]["authorization"].startswith("Bearer ")

    def test_context_manager_closes_cleanly(self, api):
        api.stub("GET", "/v2/project", json_body={"projects": []})
        with SingularityClient(token="test-token", base_url=api.base_url) as c:
            listing = c.projects.list()
        assert len(listing) == 0
        # closed session must raise a typed library error, never leak urllib internals
        c.transport.session.close()
        with pytest.raises(SingularityError):
            c.projects.list()
