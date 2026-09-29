from typing import Dict, List, Optional

from backend.memory.schemas import Outcome


class OutcomeStore:
    def __init__(self):
        self._outcomes: Dict[str, Outcome] = {}

    def create(self, outcome: Outcome) -> Outcome:
        self._outcomes[outcome.id] = outcome
        return outcome

    def get(self, outcome_id: str) -> Optional[Outcome]:
        return self._outcomes.get(outcome_id)

    def list_all(self) -> List[Outcome]:
        return list(self._outcomes.values())