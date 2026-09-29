import os

from datetime import datetime
from typing import Any, Dict, List, Optional

from hindsight_client import Hindsight


class HindsightClient:
    def __init__(self):
        self.base_url = os.getenv(
            "HINDSIGHT_API_URL",
            "https://api.hindsight.vectorize.io",
        )
        self.api_key = os.getenv("HINDSIGHT_API_KEY")
        self.bank_id = os.getenv(
            "HINDSIGHT_BANK_ID",
            "community-time-machine",
        )

        if not self.api_key:
            raise RuntimeError("HINDSIGHT_API_KEY is not configured.")

        self._client: Optional[Hindsight] = None

        self._metadata: Dict[str, Dict[str, Any]] = {}

    def _get_client(self) -> Hindsight:
        if self._client is None:
            self._client = Hindsight(
                base_url=self.base_url,
                api_key=self.api_key,
            )

        return self._client

    async def remember(
        self,
        memory_id: str,
        content: str,
        memory_type: str,
        timestamp: str,
        metadata: Optional[Dict[str, Any]] = None,
    ):
        metadata = metadata or {}

        event_timestamp = datetime.fromisoformat(
            timestamp.replace("Z", "+00:00")
        )

        client = self._get_client()

        result = await client.aretain(
            bank_id=self.bank_id,
            content=content,
            context=f"community-time-machine:{memory_type}",
            timestamp=event_timestamp,
            document_id=memory_id,
            metadata={
                "memory_id": memory_id,
                "memory_type": memory_type,
            },
        )

        self._metadata[memory_id] = {
            "id": memory_id,
            "content": content,
            "type": memory_type,
            "timestamp": timestamp,
            "metadata": metadata,
        }

        return self._metadata[memory_id]

    def get(self, memory_id: str):
        return self._metadata.get(memory_id)

    async def search(
        self,
        query: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        client = self._get_client()

        response = await client.arecall(
            bank_id=self.bank_id,
            query=query,
            max_tokens=4096,
            include_chunks=True,
        )

        results = getattr(response, "results", [])
        chunks = getattr(response, "chunks", {}) or {}

        memories = []

        for result in results[:limit]:
            document_id = getattr(result, "document_id", None)
            chunk_id = getattr(result, "chunk_id", None)
            original = None

            if document_id:
                original = self._metadata.get(document_id)

            if original is None and chunk_id:
                chunk = chunks.get(chunk_id)

                if chunk:
                    chunk_text = getattr(chunk, "text", "")

                    for memory in self._metadata.values():
                        if memory["content"] in chunk_text:
                            original = memory
                            break

            if original is not None:
                memory = dict(original)
                memory["relevance_score"] = self._get_score(result)
                memories.append(memory)
            else:
                memories.append(
                    {
                        "id": document_id or getattr(result, "id", None),
                        "content": getattr(result, "text", ""),
                        "type": getattr(result, "type", "memory"),
                        "timestamp": self._get_timestamp(result),
                        "metadata": getattr(result, "metadata", {}) or {},
                        "relevance_score": self._get_score(result),
                    }
                )

        return memories

    def delete(self, memory_id: str):
        self._metadata.pop(memory_id, None)
        return True

    def clear(self):
        self._metadata.clear()

    def list_memories(self) -> List[Dict[str, Any]]:
        return list(self._metadata.values())

    def close(self):
        if self._client is not None:
            self._client.close()
            self._client = None

    def _get_score(self, result):
        scores = getattr(result, "scores", None)

        if scores is None:
            return None

        return getattr(scores, "final", None)

    def _get_timestamp(self, result):
        timestamp = getattr(result, "occurred_start", None)

        if timestamp is None:
            timestamp = getattr(result, "mentioned_at", None)

        if timestamp is None:
            return ""

        if hasattr(timestamp, "isoformat"):
            return timestamp.isoformat()

        return str(timestamp)
    