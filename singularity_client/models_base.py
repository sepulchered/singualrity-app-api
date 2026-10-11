"""Tolerant dataclass base and generic list container.

See :mod:`singularity_client.models` for the concrete entity models.
"""

from __future__ import annotations

import datetime as _dt
from dataclasses import dataclass, field, fields, is_dataclass
from typing import Any, Dict, List, Optional


def parse_timestamp(value: Optional[str]) -> Optional[_dt.datetime]:
    """Parse a Singularity timestamp into an aware UTC ``datetime``.

    Accepts epoch milliseconds as string or int (e.g. ``"1633021234567"``)
    and ISO-8601 strings with ``Z`` or numeric offsets.  Returns ``None``
    for empty/missing values.

    >>> parse_timestamp("1633021234567").year
    2021
    >>> parse_timestamp("2026-07-01T00:00:00.000Z").tzinfo is not None
    True
    """
    if value in (None, ""):
        return None
    if isinstance(value, (int, float)) or (isinstance(value, str) and value.lstrip("-").isdigit()):
        return _dt.datetime.fromtimestamp(int(float(value)) / 1000.0, tz=_dt.timezone.utc)
    text = str(value)
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        dt = _dt.datetime.fromisoformat(text)
    except ValueError:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=_dt.timezone.utc)
    return dt.astimezone(_dt.timezone.utc)


_UNSET = object()


@dataclass
class Base:
    """Common tolerant base for all API models."""

    _extra: Dict[str, Any] = field(default_factory=dict, repr=False)

    @classmethod
    def from_dict(cls, data: Optional[Dict[str, Any]]) -> "Base":
        """Build a model instance from a JSON dict, ignoring unknown keys."""
        if data is None:
            raise ValueError(f"{cls.__name__}.from_dict requires a mapping, got None")
        known = {f.name for f in fields(cls) if not f.name.startswith("_")}
        kwargs: Dict[str, Any] = {}
        for key in known:
            if key in data:
                kwargs[key] = data[key]
        extra = {k: v for k, v in data.items() if k not in known}
        return cls(_extra=extra, **kwargs)

    def to_dict(self, drop_none: bool = True) -> Dict[str, Any]:
        """Serialize back to a JSON-ready dict.

        Unknown server fields (kept in ``_extra``) are included so that
        read-modify-write cycles do not lose data.
        """
        out: Dict[str, Any] = {}
        for f in fields(self):
            if f.name.startswith("_"):
                continue
            value = getattr(self, f.name)
            if drop_none and value is None:
                continue
            out[f.name] = _serialize(value)
        if self._extra:
            merged = dict(self._extra)
            merged.update(out)
            out = merged
        return out


def _serialize(value: Any) -> Any:
    if is_dataclass(value) and hasattr(value, "to_dict"):
        return value.to_dict()
    if isinstance(value, dict):
        return {k: _serialize(v) for k, v in value.items()}
    if isinstance(value, list):
        return [_serialize(v) for v in value]
    if hasattr(value, "value"):  # IntEnum / str Enum
        return value.value
    return value




# --------------------------------------------------------------------------- #
# Pagination
# --------------------------------------------------------------------------- #


@dataclass
class Pagination(Base):
    """``pagination`` block returned when ``paginationData=true``."""

    total: Optional[int] = None
    count: Optional[int] = None
    offset: Optional[int] = None


@dataclass
class EntityList(Base):
    """Uniform wrapper around every list response.

    ``items`` holds the typed entities; ``raw_items`` keeps the original dicts
    (useful for agents that prefer raw JSON).  ``pagination`` is populated only
    when the request set ``paginationData=true``.
    """

    items: List[Any] = field(default_factory=list)
    pagination: Optional[Pagination] = None
    raw_items: List[Dict[str, Any]] = field(default_factory=list, repr=False)

    @classmethod
    def from_response(
        cls,
        data: Dict[str, Any],
        collection_key: str,
        model: type,
    ) -> "EntityList":
        raw = data.get(collection_key) or []
        items = [model.from_dict(x) if hasattr(model, "from_dict") else x for x in raw]
        pag = data.get("pagination")
        return cls(
            items=items,
            pagination=Pagination.from_dict(pag) if pag else None,
            raw_items=list(raw),
            _extra={k: v for k, v in data.items() if k not in (collection_key, "pagination")},
        )

    def to_dicts(self) -> List[Dict[str, Any]]:
        """Return all items as plain dicts (JSON round-trip form)."""
        return [i.to_dict(drop_none=False) if hasattr(i, "to_dict") else i for i in self.items]

    def __len__(self) -> int:
        return len(self.items)

    def __iter__(self):
        return iter(self.items)

    def __getitem__(self, index: int):
        return self.items[index]


