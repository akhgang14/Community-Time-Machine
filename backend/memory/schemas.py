from dataclasses import dataclass, field
from datetime import datetime
from typing import List, Optional


@dataclass
class MessageMemory:
    id: str
    timestamp: datetime
    channel: str
    author: str
    content: str
    type: str = "message"


@dataclass
class EventMemory:
    id: str
    timestamp: datetime
    type: str
    channel: str
    title: str
    description: str
    severity: str = "info"


@dataclass
class Evidence:
    memory_id: str
    timestamp: datetime
    source_type: str
    content: str
    channel: Optional[str] = None
    relevance_score: Optional[float] = None
    metadata: dict = field(default_factory=dict)


@dataclass
class TimelineEntry:
    timestamp: datetime
    memory_id: str
    source_type: str
    summary: str
    channel: Optional[str] = None


@dataclass
class InvestigationResult:
    question: str
    timeline: List[TimelineEntry] = field(default_factory=list)
    patterns: List[str] = field(default_factory=list)
    change_points: List[str] = field(default_factory=list)
    evidence: List[Evidence] = field(default_factory=list)
    interpretation: List[str] = field(default_factory=list)
    uncertainties: List[str] = field(default_factory=list)
    suggested_actions: List[str] = field(default_factory=list)