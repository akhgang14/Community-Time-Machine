from dotenv import load_dotenv

load_dotenv()


from contextlib import asynccontextmanager

from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

from backend.api.messages import router as messages_router
from backend.api.events import router as events_router
from backend.api.memory import router as memory_router
from backend.api.investigation import router as investigation_router
from backend.services.startup import load_initial_memories
from backend.api.recurring_questions import router as recurring_questions_router
from backend.api.faqs import router as faqs_router
from backend.api.interventions import router as interventions_router
from backend.api.outcomes import router as outcomes_router
from backend.api.trends import router as trends_router
from backend.api.insights import router as insights_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await load_initial_memories()
    yield


app = FastAPI(
    title="Community Time Machine",
    version="0.1.0",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(messages_router)
app.include_router(events_router)
app.include_router(memory_router)
app.include_router(investigation_router)
app.include_router(recurring_questions_router)
app.include_router(faqs_router)
app.include_router(interventions_router)
app.include_router(outcomes_router)
app.include_router(trends_router)
app.include_router(insights_router)



@app.get("/health")
def health():
    return {"status": "ok"}