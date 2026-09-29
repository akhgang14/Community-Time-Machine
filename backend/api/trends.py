from typing import Any, Dict

from fastapi import APIRouter, Query

from backend.services.trends import TrendService


router = APIRouter(
    prefix="/trends",
    tags=["trends"],
)

trend_service = TrendService()


@router.get("")
def get_trends(
    query: str | None = Query(default=None),
) -> Dict[str, Any]:
    return trend_service.get_trends(query=query)