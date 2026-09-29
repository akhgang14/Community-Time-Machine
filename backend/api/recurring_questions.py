from typing import Any, Dict, List

from fastapi import APIRouter, Query

from backend.services.recurring_questions import RecurringQuestionService


router = APIRouter(
    prefix="/recurring-questions",
    tags=["recurring questions"],
)

recurring_question_service = RecurringQuestionService()


@router.get("")
def get_recurring_questions(
    query: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=100),
) -> Dict[str, Any]:
    clusters = recurring_question_service.detect(
        query=query,
        limit=limit,
    )

    return {
        "count": len(clusters),
        "recurring_questions": clusters,
    }