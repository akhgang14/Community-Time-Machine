from typing import Any, Dict

from fastapi import APIRouter, Query

from backend.services.insights import InsightService


router = APIRouter(
    prefix="/insights",
    tags=["insights"],
)

insight_service = InsightService()


@router.get("")
def get_insights(
    query: str | None = Query(default=None),
) -> Dict[str, Any]:
    return insight_service.get_insights(query=query)