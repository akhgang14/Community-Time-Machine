import json
from datetime import datetime

from backend.llm.groq_client import GroqLLM
from backend.memory.retrieval import MemoryRetriever
from backend.memory.schemas import (
    Evidence,
    InvestigationResult,
    TimelineEntry,
)


class InvestigationAgent:
    def __init__(
        self,
        retriever: MemoryRetriever | None = None,
        llm: GroqLLM | None = None,
    ):
        self.retriever = retriever or MemoryRetriever()
        self.llm = llm or GroqLLM()

    async def investigate(
        self,
        question: str,
        limit: int = 20,
    ) -> InvestigationResult:

        memories = await self.retriever.search(
            query=question,
            limit=limit,
        )

        if not memories:
            return InvestigationResult(
                question=question,
                uncertainties=[
                    "Insufficient evidence: no relevant community memories were found."
                ],
            )

        evidence = self._build_evidence(memories)
        timeline = self._build_timeline(memories)

        prompt = self._build_prompt(
            question=question,
            evidence=evidence,
        )

        try:
            response = self.llm.generate(
                system_prompt=self._system_prompt(),
                user_prompt=prompt,
            )

            analysis = self._parse_response(response)

        except Exception as exc:
            analysis = {
                "patterns": [],
                "change_points": [],
                "interpretation": [],
                "uncertainties": [
                    f"LLM analysis unavailable: {str(exc)}"
                ],
                "suggested_actions": [],
            }

        return InvestigationResult(
            question=question,
            timeline=timeline,
            patterns=analysis["patterns"],
            change_points=analysis["change_points"],
            evidence=evidence,
            interpretation=analysis["interpretation"],
            uncertainties=analysis["uncertainties"],
            suggested_actions=analysis["suggested_actions"],
        )

    def _build_evidence(self, memories):
        evidence = []

        for memory in memories:
            timestamp = memory.get("timestamp", "")

            try:
                parsed_timestamp = datetime.fromisoformat(
                    timestamp.replace("Z", "+00:00")
                )
            except (ValueError, AttributeError):
                continue

            evidence.append(
                Evidence(
                    memory_id=memory["id"],
                    timestamp=parsed_timestamp,
                    source_type=memory.get("type", "memory"),
                    content=memory.get("content", ""),
                    channel=memory.get("metadata", {}).get("channel"),
                    relevance_score=memory.get("relevance_score"),
                    metadata=memory.get("metadata", {}),
                )
            )

        evidence.sort(key=lambda item: item.timestamp)

        return evidence

    def _build_timeline(self, memories):
        timeline = []

        for memory in memories:
            timestamp = memory.get("timestamp", "")

            try:
                parsed_timestamp = datetime.fromisoformat(
                    timestamp.replace("Z", "+00:00")
                )
            except (ValueError, AttributeError):
                continue

            timeline.append(
                TimelineEntry(
                    timestamp=parsed_timestamp,
                    memory_id=memory["id"],
                    source_type=memory.get("type", "memory"),
                    summary=memory.get("content", ""),
                    channel=memory.get("metadata", {}).get("channel"),
                )
            )

        timeline.sort(key=lambda item: item.timestamp)

        return timeline

    def _system_prompt(self):
        return """
You are the investigation analyst for a community moderation system.

Analyze only the evidence provided.

Your job is to identify:
- recurring patterns
- notable changes over time
- events that precede changes in activity
- possible relationships between documented events and community activity
- uncertainties
- useful moderator actions

Important rules:

1. Do not invent facts.
2. Do not claim causation from temporal association alone.
3. Distinguish observations from interpretations.
4. Cite evidence using the provided memory IDs.
5. If evidence is weak or conflicting, explicitly say so.
6. Suggested actions must be recommendations only.
7. Do not take actions yourself.
8. Return valid JSON only.

Return exactly this structure:

{
  "patterns": [],
  "change_points": [],
  "interpretation": [],
  "uncertainties": [],
  "suggested_actions": []
}
"""

    def _build_prompt(self, question, evidence):
        evidence_lines = []

        for item in evidence:
            evidence_lines.append(
                f"[{item.memory_id}] "
                f"{item.timestamp.isoformat()} "
                f"({item.source_type}) "
                f"{item.content}"
            )

        evidence_text = "\n".join(evidence_lines)

        return f"""
Investigation question:

{question}

Community evidence:

{evidence_text}

Analyze the evidence and return the required JSON structure.
"""

    def _parse_response(self, response):
        try:
            data = json.loads(response)
        except json.JSONDecodeError:
            return {
                "patterns": [],
                "change_points": [],
                "interpretation": [
                    response
                ],
                "uncertainties": [
                    "The model response was not valid JSON."
                ],
                "suggested_actions": [],
            }

        return {
            "patterns": data.get("patterns", []),
            "change_points": data.get("change_points", []),
            "interpretation": data.get("interpretation", []),
            "uncertainties": data.get("uncertainties", []),
            "suggested_actions": data.get("suggested_actions", []),
        }