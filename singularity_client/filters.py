"""Helpers for building Singularity API query parameters and payloads.

The v2 list endpoints support rich filtering through ``field.op`` query
parameters (``eq``, ``ne``, ``in``, ``gt``, ``gte``, ``lt``, ``lte``,
``isSet``).  Because a parameter name like ``start.gte`` is not a valid
Python keyword, this module provides:

* :func:`f` -- build one filter pair: ``f("start", "gte", "2026-01-01...")``
* :func:`filters` -- build several at once from keyword-ish arguments.
* :func:`to_iso_utc` -- normalize ``datetime``/``date`` to the ISO-8601 UTC
  ``Z`` strings the API expects.
* :func:`clean` -- drop ``None`` values and coerce enums to primitives.

Typical usage with the client::

    from singularity_client import SingularityClient
    from singularity_client.filters import f, filters

    client = SingularityClient(token="...")
    tasks = client.tasks.list(
        params=filters(f("start", "gte", "2026-07-01T00:00:00.000Z"),
                       f("projectId", "in", ["P-1...", "P-2..."]),
                       checked=0),
    )
"""

from __future__ import annotations

import datetime as _dt
from enum import Enum
from typing import Any, Dict, Iterable, List, Mapping, Optional, Union

from .enums import FILTER_OPS
from .exceptions import SingularityConfigurationError

DateLike = Union[str, _dt.datetime, _dt.date]


def to_iso_utc(value: Optional[DateLike]) -> Optional[str]:
    """Convert *value* into an ISO-8601 UTC string ending with ``Z``.

    Accepts ``datetime``, ``date`` or ``str``.  ``datetime`` objects are
    converted to UTC; naive datetimes are assumed to already be UTC.
    ``date`` objects become ``YYYY-MM-DD``.  Strings are returned unchanged
    (the server also accepts offsets such as ``+03:00`` and normalizes them).

    >>> to_iso_utc(_dt.datetime(2026, 7, 1, 12, 0, 0))
    '2026-07-01T12:00:00.000Z'
    >>> to_iso_utc(_dt.date(2026, 7, 1))
    '2026-07-01'
    >>> to_iso_utc(None) is None
    True
    """
    if value is None:
        return None
    if isinstance(value, str):
        return value
    if isinstance(value, _dt.datetime):
        if value.tzinfo is not None:
            value = value.astimezone(_dt.timezone.utc)
        return value.strftime("%Y-%m-%dT%H:%M:%S.") + f"{value.microsecond // 1000:03d}Z"
    if isinstance(value, _dt.date):
        return value.isoformat()
    raise TypeError(f"Cannot convert {type(value).__name__} to an ISO date string")


def f(field: str, op: str, value: Any) -> Dict[str, Any]:
    """Build a single ``field.op=value`` filter dictionary.

    ``op`` must be one of :data:`~singularity_client.enums.FILTER_OPS`.
    For ``in`` filters, pass a list/tuple -- it will be joined with commas.
    ``isSet`` takes a boolean.

    >>> f("parent", "in", ["P-1", "P-2"])
    {'parent.in': 'P-1,P-2'}
    >>> f("journalDate", "isSet", False)
    {'journalDate.isSet': False}
    """
    if op not in FILTER_OPS:
        raise SingularityConfigurationError(
            f"Unknown filter operator {op!r}; expected one of {FILTER_OPS}"
        )
    if op == "in" and isinstance(value, Iterable) and not isinstance(value, str):
        value = ",".join(str(v) for v in value)
    if op == "isSet":
        value = bool(value)
    if isinstance(value, (_dt.datetime, _dt.date)):
        value = to_iso_utc(value)
    return {f"{field}.{op}": value}


def filters(*filter_pairs: Mapping[str, Any], **simple: Any) -> Dict[str, Any]:
    """Merge ``f(...)`` results and plain equality params into one dict.

    Keyword arguments become simple ``name=value`` query parameters
    (``None`` values are dropped)::

        filters(f("deadline", "lt", date.today()), projectId="P-abc", maxCount=50)
        # -> {'deadline.lt': '...', 'projectId': 'P-abc', 'maxCount': 50}
    """
    out: Dict[str, Any] = {}
    for pair in filter_pairs:
        out.update(pair)
    for key, value in simple.items():
        if value is not None:
            out[key] = _coerce(value)
    return out


def clean(payload: Mapping[str, Any]) -> Dict[str, Any]:
    """Return a shallow copy of *payload* without ``None`` values.

    Enum members (``Priority.HIGH`` ...) are coerced to their primitive value
    so JSON serialization always produces numbers/strings as the API expects.
    Nested dicts/lists are cleaned recursively.

    >>> clean({"title": "x", "note": None, "priority": 1})
    {'title': 'x', 'priority': 1}
    """
    out: Dict[str, Any] = {}
    for key, value in payload.items():
        if value is None:
            continue
        out[key] = _deep_clean(value)
    return out


def _deep_clean(value: Any) -> Any:
    if isinstance(value, Mapping):
        return clean(value)
    if isinstance(value, (list, tuple)):
        return [_deep_clean(v) for v in value if v is not None]
    return _coerce(value)


def _coerce(value: Any) -> Any:
    if isinstance(value, Enum):
        return value.value
    if isinstance(value, bool):
        return value
    if isinstance(value, (_dt.datetime, _dt.date)):
        return to_iso_utc(value)
    return value


def join_ids(values: Optional[Union[str, Iterable[str]]]) -> Optional[str]:
    """Join an iterable of IDs into the comma separated string ``in`` filters use."""
    if values is None:
        return None
    if isinstance(values, str):
        return values
    return ",".join(str(v) for v in values)


def split_list(value: Union[str, List[str]]) -> List[str]:
    """Normalize a list-or-comma-string parameter into a list of strings."""
    if isinstance(value, str):
        return [v.strip() for v in value.split(",") if v.strip()]
    return [str(v) for v in value]


__all__: List[str] = [
    "f",
    "filters",
    "clean",
    "to_iso_utc",
    "join_ids",
    "split_list",
    "DateLike",
]
