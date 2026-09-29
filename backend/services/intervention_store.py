from typing import Dict, List, Optional

from backend.memory.schemas import Intervention


class InterventionStore:
    def __init__(self):
        self._interventions: Dict[str, Intervention] = {}

    def create(self, intervention: Intervention) -> Intervention:
        self._interventions[intervention.id] = intervention
        return intervention

    def get(self, intervention_id: str) -> Optional[Intervention]:
        return self._interventions.get(intervention_id)

    def list_all(self) -> List[Intervention]:
        return list(self._interventions.values())