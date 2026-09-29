from typing import Any, Dict, List

from backend.memory.retrieval import MemoryRetriever
from backend.memory.schemas import Evidence


class EvidenceService:
    """
    Provides a reusable evidence layer for backend features.

    Investigation, recurring-question detection, and FAQ generation
    can all use this service instead of accessing the memory store
    directly.
    """

    def __init__(
        self,
        retriever: MemoryRetriever | None = None,
    ):
        self.retriever = retriever or MemoryRetriever()

    def search(
        self,
        query: str,
        limit: int = 20,
    ) -> List[Evidence]:
        """
        Retrieve memories and convert them into Evidence objects.
        """

        memories = self.retriever.search(
            query=query,
            limit=limit,
        )

        return self._to_evidence(memories)

    def get_by_memory_id(
        self,
        memory_id: str,
    ) -> Evidence | None:
        """
        Retrieve one memory and convert it to evidence.
        """

        memory = self.retriever.get_memory(memory_id)

        if memory is None:
            return None

        return self._convert_memory(memory)

    def _to_evidence(
        self,
        memories: List[Dict[str, Any]],
    ) -> List[Evidence]:
        """
        Convert retrieved memories into evidence objects.
        """

        evidence = [
            self._convert_memory(memory)
            for memory in memories
        ]

        evidence.sort(
            key=lambda item: item.timestamp
        )

        return evidence

    def _convert_memory(
        self,
        memory: Dict[str, Any],
    ) -> Evidence:
        """
        Convert a raw memory into the application's Evidence model.
        """

        from datetime import datetime

        timestamp = datetime.fromisoformat(
            memory["timestamp"].replace("Z", "+00:00")
        )

        metadata = memory.get("metadata", {})

        return Evidence(
            memory_id=memory["id"],
            timestamp=timestamp,
            source_type=memory["type"],
            content=memory["content"],
            channel=metadata.get("channel"),
            metadata=metadata,
        )