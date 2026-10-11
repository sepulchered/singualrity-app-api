"""Integer/keyword enums used by the Singularity REST API v2.

The API accepts **plain integers** for all enumerated fields (the spec says
"send the number, not the name").  The enums in this module are ``IntEnum``
subclasses, so they can be passed anywhere an ``int`` is expected and are
serialized to their numeric value automatically by the client.

Example
-------
>>> from singularity_client import Priority, TaskState
>>> body = {"title": "Write report", "priority": Priority.HIGH}
>>> int(body["priority"])
0
"""

from __future__ import annotations

from enum import Enum, IntEnum


class Priority(IntEnum):
    """Task priority (``priority`` field of task create/update/list filters)."""

    HIGH = 0
    NORMAL = 1
    LOW = 2


class TaskState(IntEnum):
    """Task pin state (``state`` field)."""

    PINNED = 0
    UNPINNED = 1


class CheckedStatus(IntEnum):
    """Task check status (``checked`` field)."""

    EMPTY = 0
    CHECKED = 1
    CANCELLED = 2


class ReviewValidationInterval(IntEnum):
    """Project review validation interval (``reviewValidationInterval``)."""

    DEF = -1      # default
    NEVER = 0
    ONEWEEK = 1
    TWOWEEKS = 2
    ONEMONTH = 3
    SIXMONTH = 4


class HabitStatus(IntEnum):
    """Habit status (``status`` field).

    .. note::
       Via REST only :attr:`ACTIVE` (0) and :attr:`ARCHIVED` (2) are allowed
       on create/update; PAUSED and DELETED are not supported through the API.
    """

    ACTIVE = 0
    PAUSED = 1
    ARCHIVED = 2
    DELETED = 3


class HabitProgress(IntEnum):
    """Daily habit progress value (``progress`` field of habit-progress records)."""

    EMPTY = 0
    SKIP = 1
    FULL = 2


class TimeStatSource(IntEnum):
    """Time-stat source (``source`` field).

    Duration limits depend on the source: POMODORO <= 7200 s, STOPWATCH <= 86400 s.
    """

    POMODORO = 0
    STOPWATCH = 1


class BatchMethod(str, Enum):
    """HTTP methods allowed inside a batch operation (``POST /v2/batch``)."""

    POST = "POST"
    PATCH = "PATCH"
    DELETE = "DELETE"


class FilterOp(str, Enum):
    """Supported comparison operators for list-endpoint filter parameters.

    Filters are expressed as query parameters of the form ``field.op`` e.g.
    ``start.gte=2026-01-01T00:00:00.000Z`` or ``parent.in=P-1,P-2``.
    Use them with :func:`singularity_client.filters.f`.
    """

    EQ = "eq"        # equals
    NE = "ne"        # not equals
    IN = "in"        # in comma separated list
    GT = "gt"        # greater than (dates)
    GTE = "gte"      # greater or equal (dates)
    LT = "lt"        # less than (dates)
    LTE = "lte"      # less or equal (dates)
    IS_SET = "isSet" # field present (true) / absent (false)


#: All filter operators accepted by the API, for validation.
FILTER_OPS = ("eq", "ne", "in", "gt", "gte", "lt", "lte", "isSet")
