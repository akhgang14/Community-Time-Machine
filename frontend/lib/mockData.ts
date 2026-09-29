import { RecurringQuestion, FAQ } from "./types";

export const mockRecurringQuestions: RecurringQuestion[] = [
  {
    id: "rq-001",
    question: "Why does authentication fail after the latest update?",
    occurrence_count: 18,
    first_seen: "2026-09-05T10:30:00Z",
    last_seen: "2026-09-27T16:45:00Z",
    related_issue_id: "issue-001",
    source_memory_ids: [
      "mem-102",
      "mem-118",
      "mem-145",
      "mem-201",
    ],
    confidence: "94%",
  },
  {
    id: "rq-002",
    question: "How do I deploy the latest game server update?",
    occurrence_count: 12,
    first_seen: "2026-09-09T08:15:00Z",
    last_seen: "2026-09-26T14:20:00Z",
    related_issue_id: "issue-002",
    source_memory_ids: [
      "mem-091",
      "mem-133",
      "mem-174",
    ],
    confidence: "89%",
  },
  {
    id: "rq-003",
    question: "Why are players getting disconnected during matchmaking?",
    occurrence_count: 9,
    first_seen: "2026-09-14T19:10:00Z",
    last_seen: "2026-09-25T21:05:00Z",
    related_issue_id: "issue-003",
    source_memory_ids: [
      "mem-155",
      "mem-178",
      "mem-196",
    ],
    confidence: "86%",
  },
];