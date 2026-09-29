from backend.agents.investigation_agent import InvestigationAgent
from backend.memory.schemas import InvestigationResult


class InvestigationService:
    """
    Application service for community investigations.

    Keeps the API layer separate from the investigation agent.
    """

    def __init__(self, agent: InvestigationAgent | None = None):
        self.agent = agent or InvestigationAgent()

    async def investigate(
        self,
        question: str,
        limit: int = 20,
    ) -> InvestigationResult:
        """
        Investigate a community question.
        """

        return await self.agent.investigate(
            question=question,
            limit=limit,
        )