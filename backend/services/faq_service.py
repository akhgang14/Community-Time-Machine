from datetime import datetime, timezone
from uuid import uuid4

from backend.memory.schemas import FAQ
from backend.services.faq_store import FAQStore


class FAQService:
    def __init__(self, store: FAQStore | None = None):
        self.store = store or FAQStore()

    def create_draft(
        self,
        question: str,
        answer: str,
        source_ids: list[str],
    ) -> FAQ:
        faq = FAQ(
            id=f"faq_{uuid4().hex[:8]}",
            question=question,
            answer=answer,
            source_ids=source_ids,
            status="DRAFT",
            created_at=datetime.now(timezone.utc),
        )

        return self.store.create(faq)

    def get(self, faq_id: str) -> FAQ | None:
        return self.store.get(faq_id)

    def find_published_by_question(
        self,
        question: str,
    ) -> FAQ | None:
        normalized_question = " ".join(
            question.lower().strip().split()
        )

        for faq in self.store.list_all():
            if faq.status != "PUBLISHED":
                continue

            existing_question = " ".join(
                faq.question.lower().strip().split()
            )

            if existing_question == normalized_question:
                return faq

        return None

    def approve(self, faq_id: str) -> FAQ | None:
        faq = self.store.get(faq_id)

        if faq is None:
            return None

        if faq.status != "DRAFT":
            return faq

        faq.status = "APPROVED"
        faq.approved_at = datetime.now(timezone.utc)

        return self.store.update(faq)

    def publish(self, faq_id: str) -> FAQ | None:
        faq = self.store.get(faq_id)

        if faq is None:
            return None

        if faq.status != "APPROVED":
            return faq

        faq.status = "PUBLISHED"
        faq.published_at = datetime.now(timezone.utc)

        return self.store.update(faq)