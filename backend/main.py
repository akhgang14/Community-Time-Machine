from fastapi import FastAPI

from backend.api.messages import router as messages_router
from backend.api.events import router as events_router
from backend.api.memory import router as memory_router
from backend.services.startup import load_initial_memories


app = FastAPI(
    title="Community Time Machine",
    version="0.1.0",
)


app.include_router(messages_router)
app.include_router(events_router)
app.include_router(memory_router)


@app.on_event("startup")
def startup_event():
    load_initial_memories()


@app.get("/health")
def health():
    return {"status": "ok"}