from typing import Any, Dict

from fastapi import APIRouter

from backend.memory.store import memory_client
from backend.services.ingestion import IngestionService

router = APIRouter(prefix="/messages", tags=["messages"])


ingestion_service = IngestionService(memory_client)


@router.post("")
def create_message(message: Dict[str, Any]):
    return ingestion_service.ingest_message(message)