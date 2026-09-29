from typing import Dict, List, Optional

from backend.memory.schemas import FAQ


class FAQStore:
    def __init__(self):
        self._faqs: Dict[str, FAQ] = {}

    def create(self, faq: FAQ) -> FAQ:
        self._faqs[faq.id] = faq
        return faq

    def get(self, faq_id: str) -> Optional[FAQ]:
        return self._faqs.get(faq_id)

    def list_all(self) -> List[FAQ]:
        return list(self._faqs.values())

    def update(self, faq: FAQ) -> FAQ:
        self._faqs[faq.id] = faq
        return faq