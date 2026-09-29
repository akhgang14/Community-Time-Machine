from typing import Any, Dict, List

from backend.memory.retrieval import MemoryRetriever


class RecurringQuestionService:
    def __init__(self, retriever: MemoryRetriever | None = None):
        self.retriever = retriever or MemoryRetriever()

    def detect(
        self,
        query: str | None = None,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        if query:
            memories = self.retriever.search(
                query=query,
                limit=limit,
            )
        else:
            memories = self._get_question_memories(limit)

        questions = [
            memory
            for memory in memories
            if self._is_question(memory)
        ]

        return self._cluster_questions(questions)

    def _get_question_memories(
        self,
        limit: int,
    ) -> List[Dict[str, Any]]:
        """
        Retrieve all stored memories and keep question memories.
        """
        memories = self.retriever.list_memories()

        questions = [
            memory
            for memory in memories
            if self._is_question(memory)
        ]

        return questions[:limit]

    def _is_question(self, memory: Dict[str, Any]) -> bool:
        metadata = memory.get("metadata", {})
        content = memory.get("content", "").strip().lower()

        if metadata.get("type") == "question":
            return True

        if content.endswith("?"):
            return True

        question_starters = (
            "how ",
            "what ",
            "why ",
            "where ",
            "when ",
            "who ",
            "does ",
            "do ",
            "can ",
            "could ",
            "is ",
            "are ",
            "has ",
            "have ",
            "anyone know ",
        )

        return content.startswith(question_starters)

    def _cluster_questions(
        self,
        questions: List[Dict[str, Any]],
    ) -> List[Dict[str, Any]]:
        clusters: List[List[Dict[str, Any]]] = []

        for question in questions:
            tokens = self._normalize(question.get("content", ""))

            placed = False

            for cluster in clusters:
                representative = cluster[0]
                representative_tokens = self._normalize(
                    representative.get("content", "")
                )

                similarity = self._similarity(
                    tokens,
                    representative_tokens,
                )

                if similarity >= 0.30:
                    cluster.append(question)
                    placed = True
                    break

            if not placed:
                clusters.append([question])

        recurring = []

        for cluster in clusters:
            if len(cluster) < 2:
                continue

            recurring.append(
                {
                    "question": self._representative_question(cluster),
                    "count": len(cluster),
                    "memory_ids": [
                        memory["id"]
                        for memory in cluster
                    ],
                    "channels": sorted(
                        {
                            memory.get("metadata", {}).get(
                                "channel"
                            )
                            for memory in cluster
                            if memory.get("metadata", {}).get(
                                "channel"
                            )
                        }
                    ),
                    "first_seen": min(
                        memory["timestamp"]
                        for memory in cluster
                    ),
                    "last_seen": max(
                        memory["timestamp"]
                        for memory in cluster
                    ),
                }
            )

        recurring.sort(
            key=lambda item: item["count"],
            reverse=True,
        )

        return recurring

    def _normalize(self, text: str) -> set[str]:
        """
        Normalize question text into meaningful domain terms.
        """

        stop_words = {
            "how",
            "do",
            "i",
            "the",
            "a",
            "an",
            "is",
            "are",
            "does",
            "anyone",
            "know",
            "what",
            "with",
            "for",
            "to",
            "new",
            "latest",
            "about",
            "still",
            "confused",
            "in",
            "on",
            "can",
            "you",
            "my",
            "application",
            "version",
        }

        words = (
            text.lower()
            .replace("?", "")
            .replace(",", "")
            .replace(".", "")
            .split()
        )

        normalized = set()

        for word in words:
            if word in stop_words:
                continue

            # Treat deploy/deployment as the same concept.
            if word in {"deploy", "deployment", "deploying"}:
                word = "deploy"

            # Treat framework variations consistently.
            if word.startswith("framework"):
                word = "framework"

            normalized.add(word)

        return normalized

    def _similarity(
        self,
        first: set[str],
        second: set[str],
    ) -> float:
        if not first or not second:
            return 0.0

        intersection = first.intersection(second)
        union = first.union(second)

        return len(intersection) / len(union)

    def _representative_question(
        self,
        questions: List[Dict[str, Any]],
    ) -> str:
        """
        Pick the longest question as the representative.
        """

        return max(
            (
                question.get("content", "")
                for question in questions
            ),
            key=len,
        )