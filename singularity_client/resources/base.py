"""Shared base class for API resource groups (projects, tasks, habits...)."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any, Dict, Optional

if TYPE_CHECKING:  # pragma: no cover
    from ..transport import Transport


class Resource:
    """Base for resource proxies bound to a :class:`Transport`."""

    #: JSON key holding the collection in list responses (e.g. ``"projects"``).
    collection_key: str = ""
    #: Model class used to parse entities of this resource.
    model: Any = None

    def __init__(self, transport: "Transport") -> None:
        self._t = transport

    # -- helpers -------------------------------------------------------- #

    def _list(self, path: str, params: Optional[Dict[str, Any]] = None):
        """GET a list endpoint and wrap it into a typed ``EntityList``."""
        from ..models_base import EntityList

        data = self._t.get(path, params=params) or {}
        return EntityList.from_response(data, self.collection_key, self.model)

    def _get(self, path: str, params: Optional[Dict[str, Any]] = None):
        data = self._t.get(path, params=params)
        return self.model.from_dict(data) if data is not None else None

    def _post(self, path: str, body: Optional[Dict[str, Any]] = None,
              params: Optional[Dict[str, Any]] = None):
        data = self._t.post(path, json_body=body, params=params)
        return self.model.from_dict(data) if data is not None else None

    def _patch(self, path: str, body: Dict[str, Any]):
        data = self._t.patch(path, json_body=body)
        return self.model.from_dict(data) if data is not None else None

    def _delete(self, path: str, params: Optional[Dict[str, Any]] = None) -> Any:
        """DELETE an endpoint; returns decoded JSON or ``None`` for 204."""
        return self._t.delete(path, params=params)
