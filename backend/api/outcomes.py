from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from backend.services.outcomes import OutcomeService


router = APIRouter(
    prefix="/interventions",
    tags=["outcomes"],
)

outcome_service = OutcomeService()


def _to_dict(outcome) -> Dict[str, Any]:
    return {
        "id": outcome.id,
        "intervention_id": outcome.intervention_id,
        "measured_at": outcome.measured_at.isoformat(),
        "before_metrics": outcome.before_metrics,
        "after_metrics": outcome.after_metrics,
        "changes": outcome.changes,
        "interpretation": outcome.interpretation,
        "status": outcome.status,
    }


@router.post("/{intervention_id}/outcome")
async def measure_outcome(
    intervention_id: str,
    payload: Dict[str, Any],
):
    query = payload.get("query")

    if not query:
        raise HTTPException(
            status_code=400,
            detail="query is required",
        )

    window_days = payload.get("window_days", 7)

    outcome = await outcome_service.measure(
        intervention_id=intervention_id,
        query=query,
        window_days=window_days,
    )

    if outcome is None:
        raise HTTPException(
            status_code=404,
            detail="Intervention not found",
        )

    return _to_dict(outcome)


@router.get("/{intervention_id}/outcome")
def get_outcome(intervention_id: str):
    outcomes = [
        outcome
        for outcome in outcome_service.list_all()
        if outcome.intervention_id == intervention_id
    ]

    if not outcomes:
        raise HTTPException(
            status_code=404,
            detail="Outcome not found",
        )

    return _to_dict(outcomes[-1])