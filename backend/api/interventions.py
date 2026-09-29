from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from backend.services.interventions import InterventionService


router = APIRouter(
    prefix="/interventions",
    tags=["interventions"],
)

intervention_service = InterventionService()


def _to_dict(intervention) -> Dict[str, Any]:
    return {
        "id": intervention.id,
        "intervention_type": intervention.intervention_type,
        "description": intervention.description,
        "timestamp": intervention.timestamp.isoformat(),
        "related_faq_id": intervention.related_faq_id,
        "target_issue": intervention.target_issue,
        "status": intervention.status,
    }


@router.post("")
def record_intervention(
    payload: Dict[str, Any],
):
    intervention_type = payload.get("intervention_type")
    description = payload.get("description")

    if not intervention_type:
        raise HTTPException(
            status_code=400,
            detail="intervention_type is required",
        )

    if not description:
        raise HTTPException(
            status_code=400,
            detail="description is required",
        )

    intervention = intervention_service.record(
        intervention_type=intervention_type,
        description=description,
        related_faq_id=payload.get("related_faq_id"),
        target_issue=payload.get("target_issue"),
    )

    return _to_dict(intervention)


@router.get("/{intervention_id}")
def get_intervention(intervention_id: str):
    intervention = intervention_service.get(intervention_id)

    if intervention is None:
        raise HTTPException(
            status_code=404,
            detail="Intervention not found",
        )

    return _to_dict(intervention)