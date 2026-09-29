import json

from backend.llm.groq_client import GroqLLM
from backend.memory.retrieval import MemoryRetriever
from backend.services.faq_service import FAQService


class FAQAgent:
    def __init__(
        self,
        retriever: MemoryRetriever | None = None,
        llm: GroqLLM | None = None,
        faq_service: FAQService | None = None,
    ):
        self.retriever = retriever or MemoryRetriever()
        self.llm = llm or GroqLLM()
        self.faq_service = faq_service

    async def generate(
        self,
        question: str,
        limit: int = 10,
    ):

        memories = await self.retriever.search(
            query=question,
            limit=limit,
        )

        if not memories:
            return {
                "status": "INSUFFICIENT_EVIDENCE",
                "question": question,
                "answer": "",
                "source_ids": [],
                "reason": (
                    "No relevant community memories were found. "
                    "An FAQ draft cannot be generated safely."
                ),
            }

        source_ids = [
            memory["id"]
            for memory in memories
            if memory.get("id")
        ]

        evidence = "\n".join(
            f"[{memory['id']}] {memory.get('content', '')}"
            for memory in memories
        )

        prompt = f"""
FAQ question:

{question}

Community evidence:

{evidence}

Create a concise, community-grounded FAQ answer.

Use ONLY information supported by the evidence.

Return JSON:

{{
  "answer": "...",
  "notes": "..."
}}
"""

        try:
            response = self.llm.generate(
                system_prompt=self._system_prompt(),
                user_prompt=prompt,
            )

            data = self._parse_response(response)

        except Exception as exc:
            return {
                "status": "LLM_ERROR",
                "question": question,
                "answer": "",
                "source_ids": source_ids,
                "reason": str(exc),
            }

        return {
            "status": "DRAFT",
            "question": question,
            "answer": data["answer"],
            "source_ids": source_ids,
            "notes": data["notes"],
        }

    def _system_prompt(self):
        return """
You are the FAQ writer for a community knowledge system.

Your job is to transform documented community evidence into a clear FAQ draft.

Rules:
1. Use only information present in the supplied evidence.
2. Never invent commands, policies, configuration, or behavior.
3. Do not infer undocumented technical details.
4. If evidence conflicts, acknowledge the conflict.
5. Prefer explicit authoritative documentation or announcements when supported by the evidence.
6. Keep the answer concise and practical.
7. This is a DRAFT. A human must approve it before publication.
8. Return valid JSON only.

Required structure:
{
  "answer": "...",
  "notes": "..."
}
"""

    def _parse_response(self, response):
        try:
            data = json.loads(response)
        except json.JSONDecodeError:
            return {
                "answer": response,
                "notes": "The model returned non-JSON output.",
            }

        return {
            "answer": data.get("answer", ""),
            "notes": data.get("notes", ""),
        }