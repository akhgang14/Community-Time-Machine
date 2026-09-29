from collections import Counter
from datetime import datetime
from backend.memory.retrieval import MemoryRetriever


class TrendService:
    def __init__(self, retriever: MemoryRetriever | None = None):
        self.retriever = retriever or MemoryRetriever()

    def get_trends(self, query: str | None = None):
        memories = self.retriever.list_memories()

        if query:
            query_words = query.lower().split()

            memories = [
                memory
                for memory in memories
                if any(
                    word in memory.get("content", "").lower()
                    for word in query_words
                )
            ]

        daily_counts = Counter()

        for memory in memories:
            timestamp = datetime.fromisoformat(
                memory["timestamp"].replace("Z", "+00:00")
            )

            day = timestamp.date().isoformat()
            daily_counts[day] += 1

        timeline = [
            {
                "date": date,
                "count": count,
            }
            for date, count in sorted(daily_counts.items())
        ]

        return {
            "query": query,
            "total_memories": len(memories),
            "timeline": timeline,
        }