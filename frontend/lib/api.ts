import type {
  Event,
  FAQ,
  Insight,
  Investigation,
  Issue,
  Message,
  Outcome,
  RecurringQuestion,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `API request failed with status ${response.status}`
    );
  }

  return response.json();
}

// ============================================
// Messages
// ============================================

export async function createMessage(
  message: Omit<Message, "id">
): Promise<Message> {
  return request<Message>("/messages", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

// ============================================
// Events
// ============================================

export async function createEvent(
  event: Omit<Event, "id">
): Promise<Event> {
  return request<Event>("/events", {
    method: "POST",
    body: JSON.stringify(event),
  });
}

// ============================================
// Investigation
// ============================================

export async function investigate(
  query: string
): Promise<Investigation> {
  const response = await request<{
    question: string;
    timeline: Array<{
      timestamp: string;
      memory_id: string;
      source_type: string;
      summary: string;
      channel?: string | null;
    }>;
    patterns: string[];
    change_points: string[];
    evidence: Array<{
      memory_id: string;
      timestamp: string;
      source_type: string;
      content: string;
      channel?: string | null;
      relevance_score?: number | null;
    }>;
    interpretation: string[];
    uncertainties: string[];
    suggested_actions: string[];
  }>("/investigate", {
    method: "POST",
    body: JSON.stringify({
      question: query,
    }),
  });

  const sourceMemoryIds = Array.from(
    new Set([
      ...response.timeline.map((item) => item.memory_id),
      ...response.evidence.map((item) => item.memory_id),
    ])
  );

  return {
    title: response.question,
    summary:
      response.interpretation[0] ||
      response.patterns[0] ||
      "Historical evidence was retrieved for this investigation.",
    timeline: response.timeline.map((item) => ({
      id: item.memory_id,
      timestamp: item.timestamp,
      type: "message" as const,
      title: item.source_type,
      description: item.summary,
      source_memory_ids: [item.memory_id],
    })),
    evidence: response.evidence.map((item) => ({
      memory_id: item.memory_id,
      timestamp: item.timestamp,
      channel: item.channel ?? undefined,
      content: item.content,
      relevance:
        item.relevance_score !== undefined &&
        item.relevance_score !== null
          ? String(item.relevance_score)
          : undefined,
    })),
    changes: response.change_points,
    interpretation: response.interpretation,
    uncertainty: response.uncertainties,
    source_memory_ids: sourceMemoryIds,
  };
}

// ============================================
// Insights
// ============================================

export async function getInsights(): Promise<Insight[]> {
  return request<Insight[]>("/insights");
}

// ============================================
// Issues
// ============================================

export async function getIssue(id: string): Promise<Issue> {
  return request<Issue>(`/issues/${id}`);
}

// ============================================
// Trends
// ============================================

export async function getTrends() {
  return request("/trends");
}

// ============================================
// Recurring Questions
// ============================================

export async function getRecurringQuestions(): Promise<
  RecurringQuestion[]
> {
  const response = await request<{
    count: number;
    recurring_questions: Array<{
      question: string;
      count: number;
      memory_ids: string[];
      channels: string[];
      first_seen: string;
      last_seen: string;
    }>;
  }>("/recurring-questions");

  return response.recurring_questions.map((item, index) => ({
    id: `recurring-${index}-${item.memory_ids[0] ?? "question"}`,
    question: item.question,
    occurrence_count: item.count,
    first_seen: item.first_seen,
    last_seen: item.last_seen,
    source_memory_ids: item.memory_ids,
  }));
}

// ============================================
// FAQ
// ============================================

type FAQApiResponse = {
  id?: string;
  faq_id?: string;
  question: string;
  answer: string;
  source_ids?: string[];
  status: FAQ["status"];
  notes?: string;
  related_issue_id?: string | null;
  confidence_notes?: string | null;
};

function normalizeFAQ(response: FAQApiResponse): FAQ {
  const id = response.id ?? response.faq_id;

  if (!id) {
    console.error("FAQ API response missing ID:", response);
    throw new Error(
      "FAQ draft was created, but the backend did not return an FAQ ID."
    );
  }

  return {
    id,
    question: response.question,
    answer: response.answer,
    source_memory_ids: response.source_ids ?? [],
    evidence_summary:
      response.notes ??
      "Evidence was retrieved from community memory.",
    related_issue_id:
      response.related_issue_id ?? undefined,
    confidence_notes:
      response.confidence_notes ??
      response.notes ??
      "The answer is based on the available community evidence.",
    status: response.status,
  };
}

export async function createFAQDraft(
  question: string
): Promise<FAQ> {
  const response =
    await request<FAQApiResponse>(
      "/faqs/draft",
      {
        method: "POST",
        body: JSON.stringify({
          question,
        }),
      }
    );

    console.log("RAW FAQ API RESPONSE:", response);

  return normalizeFAQ(response);
}

export async function getFAQ(
  id: string
): Promise<FAQ> {
  const response =
    await request<FAQApiResponse>(
      `/faqs/${id}`
    );

  return normalizeFAQ(response);
}

export async function approveFAQ(
  id: string
): Promise<FAQ> {
  const response =
    await request<FAQApiResponse>(
      `/faqs/${id}/approve`,
      {
        method: "POST",
      }
    );

  return normalizeFAQ(response);
}

export async function publishFAQ(
  id: string,
  channel: string
): Promise<FAQ> {
  const response =
    await request<FAQApiResponse>(
      `/faqs/${id}/publish`,
      {
        method: "POST",
        body: JSON.stringify({
          channel,
        }),
      }
    );

  return normalizeFAQ(response);
}

// ============================================
// Intervention Outcome
// ============================================

export async function getInterventionOutcome(
  id: string
): Promise<Outcome> {
  return request<Outcome>(
    `/interventions/${id}/outcome`
  );
}


export async function measureInterventionOutcome(
  id: string,
  query: string,
  windowDays: number = 7
): Promise<Outcome> {
  return request<Outcome>(
    `/interventions/${id}/outcome`,
    {
      method: "POST",
      body: JSON.stringify({
        query,
        window_days: windowDays,
      }),
    }
  );
}