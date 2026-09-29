// ============================================
// Community Time Machine - Frontend Types
// ============================================

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  channel?: string;
  user_id?: string;
  topic?: string;
}

export interface Event {
  id: string;
  type: string;
  timestamp: string;
  description?: string;
  source_memory_ids?: string[];
}

export interface Insight {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
  source_memory_ids: string[];
  confidence?: string;
}

export interface Issue {
  id: string;
  title: string;
  description?: string;
  status?: string;
  first_seen?: string;
  last_seen?: string;
  source_memory_ids?: string[];
}

export interface TimelineItem {
  id: string;
  timestamp: string;
  type: "message" | "event" | "insight" | "intervention";
  title: string;
  description?: string;
  source_memory_ids?: string[];
}

export interface RecurringQuestion {
  id: string;
  question: string;
  occurrence_count: number;
  first_seen?: string;
  last_seen?: string;
  related_issue_id?: string;
  source_memory_ids: string[];
  confidence?: string;
}

export interface Evidence {
  memory_id: string;
  timestamp?: string;
  channel?: string;
  content: string;
  relevance?: string;
}

export interface Investigation {
  issue_id?: string;
  title: string;
  summary: string;

  timeline: TimelineItem[];

  evidence: Evidence[];

  changes?: string[];

  interpretation?: string[];

  uncertainty?: string[];

  source_memory_ids: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;

  source_memory_ids: string[];

  evidence_summary: string;

  related_issue_id?: string;

  confidence_notes?: string;

  status: "DRAFT" | "APPROVED" | "PUBLISHED" | "REJECTED";
}

export interface Intervention {
  id: string;
  type: string;
  description: string;
  timestamp: string;

  faq_id?: string;
  channel?: string;

  source_memory_ids?: string[];
}

export interface Outcome {
  id: string;
  intervention_id: string;

  before_count?: number;
  after_count?: number;

  unique_users_before?: number;
  unique_users_after?: number;

  time_to_resolution_before?: number;
  time_to_resolution_after?: number;

  evaluated_at?: string;

  notes?: string;
}