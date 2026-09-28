from typing import Any, Dict, List

from fastapi import APIRouter, Query

from backend.memory.store import memory_client

router = APIRouter(prefix="/memory", tags=["memory"])


@router.get("/search")
def search_memory(
    q: str = Query(..., min_length=1),
    limit: int = Query(10, ge=1, le=100),
) -> Dict[str, Any]:
    """
    Search community memories.

    This endpoint provides the retrieval contract used by
    investigation, recurring-question detection, and FAQ generation.
    """

    results: List[Dict[str, Any]] = memory_client.search(
        query=q,
        limit=limit,
    )

    return {
        "query": q,
        "count": len(results),
        "memories": results,
    }