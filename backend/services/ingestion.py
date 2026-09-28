from typing import Any, Dict

from backend.memory.hindsight_client import HindsightClient


class IngestionService:
    """
    Handles adding new messages and events to community memory.
    """

    def __init__(self, memory_client: HindsightClient):
        self.memory_client = memory_client

    def ingest_message(self, message: Dict[str, Any]) -> Dict[str, Any]:
        """Store a community message as a memory."""

        return self.memory_client.remember(
            memory_id=message["id"],
            content=message["content"],
            memory_type="message",
            timestamp=message["timestamp"],
            metadata={
                "channel": message["channel"],
                "author": message["author"],
                "type": message.get("type", "message"),
            },
        )

    def ingest_event(self, event: Dict[str, Any]) -> Dict[str, Any]:
        """Store a community event as a memory."""

        content = (
            f"{event['title']}: "
            f"{event['description']}"
        )

        return self.memory_client.remember(
            memory_id=event["id"],
            content=content,
            memory_type="event",
            timestamp=event["timestamp"],
            metadata={
                "channel": event["channel"],
                "event_type": event["type"],
                "severity": event.get("severity", "info"),
            },
        )