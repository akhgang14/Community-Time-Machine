import json
from pathlib import Path
from typing import Any, Dict, List

from .store import memory_client


class MemoryRetriever:
    """
    Handles loading community data and retrieving relevant memories.

    HindsightClient is kept behind this layer so the investigation
    agent does not need to know how memories are stored.
    """

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.client = memory_client

    async def load_data(self) -> None:
        """Load messages and events into the memory store."""

        await self._load_messages()
        await self._load_events()

    async def _load_messages(self) -> None:
        path = self.data_dir / "messages.json"

        with open(path, "r", encoding="utf-8") as file:
            messages = json.load(file)

        for message in messages:
            await self.client.remember(
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

    async def _load_events(self) -> None:
        path = self.data_dir / "events.json"

        with open(path, "r", encoding="utf-8") as file:
            events = json.load(file)

        for event in events:
            await self.client.remember(
                memory_id=event["id"],
                content=(
                    f"{event['title']}: "
                    f"{event['description']}"
                ),
                memory_type="event",
                timestamp=event["timestamp"],
                metadata={
                    "channel": event["channel"],
                    "event_type": event["type"],
                    "severity": event.get("severity", "info"),
                },
            )

    def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve memories relevant to a query.
        """

        return self.client.search(
            query=query,
            limit=limit,
        )

    def get_memory(
        self,
        memory_id: str,
    ) -> Dict[str, Any] | None:
        """Retrieve a specific memory by ID."""

        return self.client.get(memory_id)
    

    def list_memories(self) -> List[Dict[str, Any]]:
        """Return all currently stored memories."""
        return self.client.list_memories()

    def close(self):
        self.client.close()