from datetime import datetime, timezone
from uuid import uuid4

from backend.memory.schemas import Intervention
from backend.services.intervention_store import InterventionStore
from backend.services.intervention_store_instance import intervention_store


class InterventionService:
    def __init__(self, store: InterventionStore | None = None):
        self.store = store or intervention_store

    def record(
        self,
        intervention_type: str,
        description: str,
        related_faq_id: str | None = None,
        target_issue: str | None = None,
    ) -> Intervention:
        intervention = Intervention(
            id=f"intervention_{uuid4().hex[:8]}",
            intervention_type=intervention_type,
            description=description,
            timestamp=datetime.now(timezone.utc),
            related_faq_id=related_faq_id,
            target_issue=target_issue,
        )

        return self.store.create(intervention)

    def get(self, intervention_id: str) -> Intervention | None:
        return self.store.get(intervention_id)

    def list_all(self):
        return self.store.list_all()