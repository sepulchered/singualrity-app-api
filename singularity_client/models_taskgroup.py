"""Task-group model (kept in its own module to avoid import cycles)."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Optional

from .models_base import Base


@dataclass
class TaskGroup(Base):
    """A task group (``Q-...`` id) that lives inside a project."""

    id: Optional[str] = None
    title: Optional[str] = None
    externalId: Optional[str] = None
    modificatedDate: Optional[str] = None
    parent: Optional[str] = None
    parentOrder: Optional[float] = None
    fake: Optional[bool] = None
    removed: Optional[bool] = None
    modificated: Optional[Dict[str, Any]] = None
