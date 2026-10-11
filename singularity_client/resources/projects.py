"""Projects resource -- ``/v2/project`` endpoints.

Projects are top-level containers (ids prefixed ``P-``).  Creating a project
also creates a default task group; deleting moves it to the basket
(``deleteDate``) and archiving sets ``journalDate``.
"""

from __future__ import annotations

from typing import Any, Dict, Optional, Union

from ..filters import clean
from ..models import EntityList, Project, ProjectCreateResult
from .base import Resource


class ProjectsResource(Resource):
    """Accessed as ``client.projects`` / ``client.project``."""

    collection_key = "projects"
    model = Project

    def list(self, params: Optional[Dict[str, Any]] = None) -> EntityList:
        """GET ``/v2/project`` -- list projects.

        Args:
            params: optional query parameters/filters, e.g.
                ``{"includeArchived": True, "parent.isSet": False,
                   "maxCount": 100}``.  Booleans/dates/enums are normalized
                automatically.  See ``docs/api_reference.md`` for all keys.

        Returns:
            :class:`~singularity_client.models_base.EntityList` of
            :class:`~singularity_client.models.Project` with ``pagination``
            populated when ``paginationData=true`` was requested.
        """
        return self._list("/v2/project", params=params)

    def get(self, id: str, include_removed: Optional[bool] = None,
            fields: Optional[str] = None) -> Optional[Project]:
        """GET ``/v2/project/{id}`` -- fetch one project by ID.

        Args:
            id: project identifier (``P-...``).
            include_removed: also return projects deleted to the basket.
            fields: comma separated field projection supported by the API.
        Raises:
            NotFoundError: unknown id.
        """
        params = {"includeRemoved": None if include_removed is None else str(include_removed).lower(),
                  "fields": fields}
        return self._get(f"/v2/project/{id}", params=clean(params))

    def create(self, title: str, **fields: Any) -> ProjectCreateResult:
        """POST ``/v2/project`` -- create a project.

        Args:
            title: required project title.
            **fields: any ``ProjectCreateDto`` field: ``note``, ``start``,
                ``end``, ``deleteDate``, ``journalDate``, ``showInBasket``,
                ``emoji``, ``color`` (hex like ``#FF0000``), ``externalId``,
                ``reviewValidationDate``, ``reviewValidationInterval``
                (int or :class:`~singularity_client.enums.ReviewValidationInterval`),
                ``parent`` (``P-...``), ``parentOrder``, ``isNotebook``.

        Returns:
            :class:`~singularity_client.models.ProjectCreateResult` holding the
            new ``project`` and its auto-created default ``taskGroup``.
        """
        body = clean({"title": title, **fields})
        data = self._t.post("/v2/project", json_body=body)
        return ProjectCreateResult.from_dict(data or {})

    def update(self, id: str, **fields: Any) -> Project:
        """PATCH ``/v2/project/{id}`` -- partial update.

        Only provided fields are sent; pass exactly what must change.
        Setting ``journalDate`` archives the project, ``deleteDate`` baskets it.
        """
        body = clean(dict(fields))
        if not body:
            raise ValueError("update() requires at least one field to change")
        return self._patch(f"/v2/project/{id}", body)  # type: ignore[return-value]

    def delete(self, id: str) -> None:
        """DELETE ``/v2/project/{id}`` -- move project to the basket (HTTP 204)."""
        self._t.delete(f"/v2/project/{id}")

    def archive(self, id: str, journal_date: Optional[str] = None) -> Project:
        """POST ``/v2/project/{id}/archive`` -- archive a project.

        Args:
            journal_date: optional archivation date (ISO string); server defaults to now.
        """
        body = clean({"journalDate": journal_date})
        return self._post(f"/v2/project/{id}/archive", body or {})  # type: ignore[return-value]

    def unarchive(self, id: str) -> Project:
        """POST ``/v2/project/{id}/unarchive`` -- restore an archived project."""
        return self._post(f"/v2/project/{id}/unarchive", {})  # type: ignore[return-value]

    # convenience alias ------------------------------------------------- #
    def create_project(self, title: str, **fields: Any) -> ProjectCreateResult:  # pragma: no cover
        """Alias of :meth:`create` for agent discoverability."""
        return self.create(title, **fields)
