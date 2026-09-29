import json
from pathlib import Path
from datetime import datetime

from backend.memory.schemas import FAQ
from backend.services.faq_service import FAQService


def load_seed_faqs(
    faq_service: FAQService,
    data_dir: str = "data",
) -> None:
    path = Path(data_dir) / "seed_faqs.json"

    if not path.exists():
        return

    with open(path, "r", encoding="utf-8") as file:
        faqs = json.load(file)

    for item in faqs:
        faq = FAQ(
            id=item["id"],
            question=item["question"],
            answer=item["answer"],
            source_ids=item.get("source_ids", []),
            status=item.get("status", "PUBLISHED"),
            created_at=_parse_timestamp(
                item.get("created_at")
            ),
            approved_at=_parse_timestamp(
                item.get("approved_at")
            ),
            published_at=_parse_timestamp(
                item.get("published_at")
            ),
        )

        faq_service.store.create(faq)


def _parse_timestamp(value):
    if not value:
        return None

    return datetime.fromisoformat(
        value.replace("Z", "+00:00")
    )