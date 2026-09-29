from backend.memory.retrieval import MemoryRetriever
from backend.services.recurring_questions import RecurringQuestionService
from backend.services.trends import TrendService


class InsightService:
    def __init__(
        self,
        retriever: MemoryRetriever | None = None,
        recurring_service: RecurringQuestionService | None = None,
        trend_service: TrendService | None = None,
    ):
        self.retriever = retriever or MemoryRetriever()
        self.recurring_service = (
            recurring_service or RecurringQuestionService()
        )
        self.trend_service = trend_service or TrendService()

    def get_insights(self, query: str | None = None):
        memories = self.retriever.list_memories()

        if query:
            query_words = query.lower().split()

            relevant_memories = [
                memory
                for memory in memories
                if any(
                    word in memory.get("content", "").lower()
                    for word in query_words
                )
            ]
        else:
            relevant_memories = memories

        trends = self.trend_service.get_trends(query=query)

        recurring_questions = self.recurring_service.detect(
            query=query,
            limit=20,
        )

        insights = []

        if trends["total_memories"] > 0:
            insights.append(
                f"{trends['total_memories']} relevant community memories "
                "were found for this topic."
            )

        if recurring_questions:
            insights.append(
                f"{len(recurring_questions)} recurring question pattern(s) "
                "were detected."
            )

        error_count = sum(
            1
            for memory in relevant_memories
            if "error" in memory.get("content", "").lower()
        )

        if error_count:
            insights.append(
                f"{error_count} relevant message(s) mention an error."
            )

        return {
            "query": query,
            "memory_count": len(relevant_memories),
            "insights": insights,
            "trends": trends,
            "recurring_questions": recurring_questions,
        }