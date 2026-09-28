from typing import Any, Dict, List, Optional


class HindsightClient:
    """
    Abstraction around the Hindsight persistent memory system.

    The rest of the application should interact with this class
    rather than depending directly on Hindsight's implementation.
    """

    def __init__(self):
        self._memories: Dict[str, Dict[str, Any]] = {}

    def remember(
        self,
        memory_id: str,
        content: str,
        memory_type: str,
        timestamp: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Store a memory.

        This is currently an in-memory development implementation.
        It can later be replaced with the real Hindsight API.
        """

        memory = {
            "id": memory_id,
            "content": content,
            "type": memory_type,
            "timestamp": timestamp,
            "metadata": metadata or {},
        }

        self._memories[memory_id] = memory

        return memory

    def get(self, memory_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve one memory by ID."""
        return self._memories.get(memory_id)

    def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """
        Search stored memories.

        This is intentionally simple for development.
        Semantic Hindsight retrieval will replace this later.
        """

        query_words = set(query.lower().split())

        results = []

        for memory in self._memories.values():
            content = memory["content"].lower()

            score = sum(
                1
                for word in query_words
                if word in content
            )

            if score > 0:
                results.append((score, memory))

        results.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        return [
            memory
            for _, memory in results[:limit]
        ]

    def delete(self, memory_id: str) -> bool:
        """Delete a memory by ID."""

        if memory_id not in self._memories:
            return False

        del self._memories[memory_id]

        return True

    def clear(self) -> None:
        """Clear all development memories."""
        self._memories.clear()