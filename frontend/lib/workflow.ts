export type WorkflowState = {
  selectedQuestion: string | null;
  selectedIssueId: string | null;
  faqId: string | null;
  faqStatus:
    | "DRAFT"
    | "APPROVED"
    | "PUBLISHED"
    | "REJECTED"
    | null;
  publishedChannel: string | null;
  interventionId: string | null;
};

const defaultWorkflow: WorkflowState = {
  selectedQuestion: null,
  selectedIssueId: null,
  faqId: null,
  faqStatus: null,
  publishedChannel: null,
  interventionId: null,
};

const STORAGE_KEY = "community-time-machine-workflow";

export function getWorkflow(): WorkflowState {
  if (typeof window === "undefined") {
    return defaultWorkflow;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return defaultWorkflow;
  }

  try {
    return {
      ...defaultWorkflow,
      ...JSON.parse(stored),
    };
  } catch {
    return defaultWorkflow;
  }
}

export function updateWorkflow(
  updates: Partial<WorkflowState>
) {
  if (typeof window === "undefined") {
    return;
  }

  const current = getWorkflow();

  const next = {
    ...current,
    ...updates,
  };

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(next)
  );

  window.dispatchEvent(
    new CustomEvent("workflow-updated")
  );
}

export function clearWorkflow() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);

  window.dispatchEvent(
    new CustomEvent("workflow-updated")
  );
}