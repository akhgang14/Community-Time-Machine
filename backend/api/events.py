from typing import Any, Dict

from fastapi import APIRouter

from backend.memory.store import memory_client
from backend.services.ingestion import IngestionService

router = APIRouter(prefix="/events", tags=["events"])

ingestion_service = IngestionService(memory_client)


@router.post("")
def create_event(event: Dict[str, Any]):
    return ingestion_service.ingest_event(event)