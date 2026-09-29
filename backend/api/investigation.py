from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from backend.services.investigation import InvestigationService


router = APIRouter(
    prefix="/investigate",
    tags=["investigation"],
)

investigation_service = InvestigationService()


@router.post("")
async def investigate(payload: Dict[str, Any]):
    """
    Investigate a community question using stored memories.
    """

    question = payload.get("question")

    if not question or not isinstance(question, str):
        raise HTTPException(
            status_code=400,
            detail="question is required and must be a string",
        )

    limit = payload.get("limit", 20)

    if not isinstance(limit, int) or limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="limit must be an integer between 1 and 100",
        )

    result = await investigation_service.investigate(
        question=question,
        limit=limit,
    )

    return {
        "question": result.question,
        "timeline": [
            {
                "timestamp": entry.timestamp.isoformat(),
                "memory_id": entry.memory_id,
                "source_type": entry.source_type,
                "summary": entry.summary,
                "channel": entry.channel,
            }
            for entry in result.timeline
        ],
        "patterns": result.patterns,
        "change_points": result.change_points,
        "evidence": [
            {
                "memory_id": item.memory_id,
                "timestamp": item.timestamp.isoformat(),
                "source_type": item.source_type,
                "content": item.content,
                "channel": item.channel,
                "relevance_score": item.relevance_score,
                "metadata": item.metadata,
            }
            for item in result.evidence
        ],
        "interpretation": result.interpretation,
        "uncertainties": result.uncertainties,
        "suggested_actions": result.suggested_actions,
    }