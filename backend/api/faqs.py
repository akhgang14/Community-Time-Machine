from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from backend.agents.faq_agent import FAQAgent
from backend.services.faq_service import FAQService
from backend.services.faq_startup import load_seed_faqs
from backend.services.interventions import InterventionService


router = APIRouter(
    prefix="/faqs",
    tags=["faqs"],
)


# Services
faq_service = FAQService()
intervention_service = InterventionService()

# FAQ agent
faq_agent = FAQAgent(
    faq_service=faq_service,
)

# Load the seed FAQs into the FAQ store
load_seed_faqs(faq_service)


def _faq_to_dict(faq) -> Dict[str, Any]:
    return {
        "id": faq.id,
        "question": faq.question,
        "answer": faq.answer,
        "source_ids": faq.source_ids,
        "status": faq.status,
        "created_at": (
            faq.created_at.isoformat()
            if faq.created_at
            else None
        ),
        "approved_at": (
            faq.approved_at.isoformat()
            if faq.approved_at
            else None
        ),
        "published_at": (
            faq.published_at.isoformat()
            if faq.published_at
            else None
        ),
    }


@router.post("/draft")
async def create_faq_draft(payload: Dict[str, Any]):
    question = payload.get("question")

    if not question or not isinstance(question, str):
        raise HTTPException(
            status_code=400,
            detail="question is required and must be a string",
        )

    source_ids = payload.get("source_ids")

    if source_ids is not None and not isinstance(source_ids, list):
        raise HTTPException(
            status_code=400,
            detail="source_ids must be a list",
        )

    result = await faq_agent.generate(
        question=question,
    )

    # Existing FAQ / insufficient evidence / LLM error
    # should not create a new FAQ record.
    if result.get("status") != "DRAFT":
        return result

    faq = faq_service.create_draft(
        question=result["question"],
        answer=result["answer"],
        source_ids=result.get("source_ids", []),
    )

    response = _faq_to_dict(faq)
    response["notes"] = result.get("notes", "")

    return response


@router.post("/{faq_id}/approve")
def approve_faq(faq_id: str):
    """
    Approve a FAQ draft.

    Only an existing FAQ can be approved.
    """

    faq = faq_service.approve(faq_id)

    if faq is None:
        raise HTTPException(
            status_code=404,
            detail="FAQ not found",
        )

    return _faq_to_dict(faq)


@router.post("/{faq_id}/publish")
def publish_faq(faq_id: str):
    """
    Publish an approved FAQ.

    When an FAQ transitions from APPROVED to PUBLISHED,
    an intervention is automatically recorded.
    """

    faq = faq_service.get(faq_id)

    if faq is None:
        raise HTTPException(
            status_code=404,
            detail="FAQ not found",
        )

    previous_status = faq.status

    faq = faq_service.publish(faq_id)

    if faq is None:
        raise HTTPException(
            status_code=404,
            detail="FAQ not found",
        )

    # Prevent duplicate intervention records when an already
    # published FAQ is requested again.
    if previous_status != "APPROVED" or faq.status != "PUBLISHED":
        return _faq_to_dict(faq)

    intervention = intervention_service.record(
        intervention_type="FAQ_PUBLISHED",
        description=f"Published FAQ: {faq.question}",
        related_faq_id=faq.id,
        target_issue="recurring community question",
    )

    result = _faq_to_dict(faq)

    result["intervention"] = {
        "id": intervention.id,
        "type": intervention.intervention_type,
        "description": intervention.description,
        "timestamp": intervention.timestamp.isoformat(),
    }

    return result


@router.get("/{faq_id}")
def get_faq(faq_id: str):
    """
    Retrieve a FAQ by ID.
    """

    faq = faq_service.get(faq_id)

    if faq is None:
        raise HTTPException(
            status_code=404,
            detail="FAQ not found",
        )

    return _faq_to_dict(faq)