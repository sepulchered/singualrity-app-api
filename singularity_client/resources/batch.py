"""Batch resource -- ``POST /v2/batch``.

The batch endpoint executes up to a list of public REST operations in ONE
HTTP round-trip.  Each operation is ``{method, path, body?, uuid?, tempId?}``:

* ``method`` -- POST / PATCH / DELETE only;
* ``path``   -- must start with ``/v2/`` (e.g. ``/v2/task``);
* ``uuid``   -- client-chosen correlation id for the per-operation result;
* ``tempId`` -- placeholder id usable by *later* operations in the same batch
  (e.g. create a project with ``tempId="new-project"`` then create tasks whose
  ``projectId`` references ``new-project``).  The server returns a mapping from
  temp ids to real ids in ``tempIdMap``.

Results are returned per operation with their own HTTP status -- the batch
call itself succeeds even if individual operations fail, so ALWAYS inspect
:attr:`singularity_client.models.BatchResult.results`.
"""

from __future__ import annotations

import uuid as _uuid
from typing import Any, Dict, Iterable, List, Optional, Union

from ..models import BatchOperation, BatchResult
from .base import Resource


class BatchResource(Resource):
    """Accessed as ``client.batch``."""

    def op(
        self,
        method: str,
        path: str,
        body: Optional[Dict[str, Any]] = None,
        *,
        uuid: Optional[str] = None,
        temp_id: Optional[str] = None,
    ) -> BatchOperation:
        """Create a :class:`BatchOperation` (does not execute anything yet).

        Args:
            method: "POST", "PATCH" or "DELETE".
            path: REST path starting with "/v2/" (query strings allowed).
            body: JSON body for the target endpoint.
            uuid: optional correlation id auto-generated when omitted later.
            temp_id: optional placeholder id for cross-operation references.
        """
        method = str(getattr(method, "value", method)).upper()
        if method not in ("POST", "PATCH", "DELETE"):
            raise ValueError(f"Batch supports POST/PATCH/DELETE only, got {method!r}")
        if not path.startswith("/v2/"):
            raise ValueError(f"Batch operation path must start with /v2/, got {path!r}")
        return BatchOperation(method=method, path=path, body=body, uuid=uuid, tempId=temp_id)

    def execute(self, operations: Iterable[Union[BatchOperation, Dict[str, Any]]]) -> BatchResult:
        """POST ``/v2/batch`` -- run all operations server-side.

        Accepts :class:`BatchOperation` objects or plain dicts.  Missing
        ``uuid`` values are filled with generated UUID4s so results can be
        correlated back to the caller's intent.
        """
        ops: List[Dict[str, Any]] = []
        for item in operations:
            if isinstance(item, dict):
                data = dict(item)
                data.setdefault("uuid", str(_uuid.uuid4()))
            else:
                if item.uuid is None:
                    item.uuid = str(_uuid.uuid4())
                data = item.to_dict()
            ops.append(data)
        payload = {"operations": ops}
        data = self._t.post("/v2/batch", json_body=payload) or {}
        return BatchResult.from_dict(data)

    # convenience aliases ------------------------------------------------#
    post = op  # semantic sugar: batch.post("POST", ...) reads nicely
