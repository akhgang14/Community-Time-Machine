from datetime import datetime, timedelta, timezone
from uuid import uuid4

from backend.memory.retrieval import MemoryRetriever
from backend.memory.schemas import Outcome
from backend.services.interventions import InterventionService
from backend.services.outcome_store import OutcomeStore
from backend.services.outcome_store_instance import outcome_store


class OutcomeService:
    def __init__(
        self,
        retriever: MemoryRetriever | None = None,
        intervention_service: InterventionService | None = None,
        store: OutcomeStore | None = None,
    ):
        self.retriever = retriever or MemoryRetriever()
        self.intervention_service = (
            intervention_service or InterventionService()
        )
        self.store = store or outcome_store

    async def measure(
        self,
        intervention_id: str,
        query: str,
        window_days: int = 7,
    ) -> Outcome | None:

        intervention = self.intervention_service.get(
            intervention_id
        )

        if intervention is None:
            return None

        intervention_time = intervention.timestamp

        before_start = (
            intervention_time
            - timedelta(days=window_days)
        )

        after_end = (
            intervention_time
            + timedelta(days=window_days)
        )

        memories = await self.retriever.search(
            query=query,
            limit=100,
        )

        before = []
        after = []

        for memory in memories:
            timestamp = datetime.fromisoformat(
                memory["timestamp"].replace("Z", "+00:00")
            )

            if before_start <= timestamp < intervention_time:
                before.append(memory)

            elif intervention_time <= timestamp <= after_end:
                after.append(memory)

        before_metrics = self._metrics(before)
        after_metrics = self._metrics(after)

        changes = {
            key: after_metrics.get(key, 0)
            - before_metrics.get(key, 0)
            for key in before_metrics
        }

        interpretation = self._interpret(
            before_metrics,
            after_metrics,
            changes,
        )

        outcome = Outcome(
            id=f"outcome_{uuid4().hex[:8]}",
            intervention_id=intervention_id,
            measured_at=datetime.now(timezone.utc),
            before_metrics=before_metrics,
            after_metrics=after_metrics,
            changes=changes,
            interpretation=interpretation,
        )

        return self.store.create(outcome)

    def _metrics(self, memories):
        question_count = sum(
            1
            for memory in memories
            if memory.get("metadata", {}).get("type") == "question"
            or memory.get("content", "").strip().endswith("?")
        )

        error_count = sum(
            1
            for memory in memories
            if "error" in memory.get("content", "").lower()
        )

        return {
            "message_count": len(memories),
            "question_count": question_count,
            "error_count": error_count,
        }

    def _interpret(
        self,
        before,
        after,
        changes,
    ):
        if not before and not after:
            return (
                "No relevant memories were found in either "
                "measurement window."
            )

        if not after:
            return (
                "No relevant post-intervention data is available "
                "for evaluation."
            )

        return (
            "Observed changes in community activity are reported "
            "as temporal associations. They do not establish "
            "that the intervention caused the changes."
        )

    def get(self, outcome_id: str):
        return self.store.get(outcome_id)

    def list_all(self):
        return self.store.list_all()