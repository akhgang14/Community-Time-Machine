# Community Time Machine

> **An AI-powered community memory and intervention system that turns recurring community questions and past discussions into reusable knowledge, FAQs, and measurable interventions.**

Community Time Machine is a full-stack AI application designed to help developer and technical communities **remember what has already been discussed, identify recurring questions, create knowledge from repeated issues, and measure whether interventions actually help**.

Instead of treating every community question as a new problem, the system uses persistent memory to connect current questions with historical discussions, previous answers, recurring issues, FAQs, and intervention outcomes.

---

## Table of Contents

* [Overview](#overview)
* [Problem Statement](#problem-statement)
* [Solution](#solution)
* [Key Features](#key-features)
* [Architecture](#architecture)
* [Project Flow](#project-flow)
* [Technology Stack](#technology-stack)
* [Project Structure](#project-structure)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [Frontend](#frontend)
* [Backend](#backend)
* [Hindsight Memory Layer](#hindsight-memory-layer)
* [Core Workflows](#core-workflows)
* [API Endpoints](#api-endpoints)
* [Frontend Workflow State](#frontend-workflow-state)
* [FAQ Workflow](#faq-workflow)
* [Recurring Questions](#recurring-questions)
* [Interventions and Outcomes](#interventions-and-outcomes)
* [Example API Requests](#example-api-requests)
* [Troubleshooting](#troubleshooting)
* [Development Guidelines](#development-guidelines)
* [Future Improvements](#future-improvements)
* [License](#license)

---

# Overview

Community Time Machine is built around one central idea:

> **Community knowledge should accumulate instead of disappearing into old conversations.**

In a typical developer community, the same questions appear repeatedly:

* How do I deploy this application?
* Why is a particular framework version failing?
* How did another developer solve this problem?
* Was this issue already discussed?
* What solution worked previously?
* Did the solution actually reduce the number of future questions?

Community Time Machine addresses these problems through a combination of:

1. **Persistent AI memory**
2. **Semantic retrieval**
3. **Recurring-question detection**
4. **FAQ generation**
5. **Community interventions**
6. **Outcome measurement**

---

# Problem Statement

Traditional community platforms primarily store conversations.

They do not automatically transform those conversations into durable organizational knowledge.

For example:

```text
Question
   ↓
Community discussion
   ↓
Answer
   ↓
Conversation disappears into history
   ↓
Same question appears again
```

This creates repeated work for both community members and maintainers.

Community Time Machine changes the model to:

```text
Community Question
        ↓
Search Community Memory
        ↓
Retrieve Historical Context
        ↓
Generate / Reuse Knowledge
        ↓
Detect Recurring Problems
        ↓
Create FAQ or Intervention
        ↓
Publish Solution
        ↓
Measure Outcome
        ↓
Store Result Back Into Memory
```

The system therefore creates a feedback loop where community knowledge becomes progressively more useful.

---

# Solution

Community Time Machine combines a modern web frontend with a Python backend and a persistent memory system.

The major layers are:

```text
┌──────────────────────────────────────────────────────┐
│                    FRONTEND                          │
│                                                      │
│ Next.js + React + TypeScript                         │
│                                                      │
│ Dashboard                                            │
│ Recurring Questions                                  │
│ FAQ Workflow                                         │
│ Investigations                                       │
│ Interventions                                        │
│ Outcomes                                             │
└──────────────────────┬───────────────────────────────┘
                       │
                       │ HTTP / REST API
                       ▼
┌──────────────────────────────────────────────────────┐
│                     BACKEND                          │
│                                                      │
│ FastAPI / Python                                     │
│                                                      │
│ Retrieval                                            │
│ FAQ generation                                       │
│ Recurring-question analysis                          │
│ Evidence                                             │
│ Interventions                                        │
│ Outcome measurement                                  │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│                MEMORY / AI LAYER                     │
│                                                      │
│ Hindsight                                            │
│                                                      │
│ Retain → Store community knowledge                   │
│ Recall → Retrieve relevant historical knowledge      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

# Key Features

## 1. Community Memory

The application can retain useful information from community interactions and retrieve it later.

This allows the system to answer new questions using historical context.

---

## 2. Semantic Retrieval

Instead of relying only on exact keyword matches, the backend can retrieve semantically related historical information.

For example:

```text
Current question:

"How can I deploy Framework v2?"

Historical discussion:

"Framework version 2 deployment fails during production build."

```

The memory layer can recognize that these questions are related even though the wording is different.

---

## 3. Recurring Question Detection

The application identifies questions or issues that repeatedly appear in the community.

Example:

```text
Question 1:
How do I deploy Framework v2?

Question 2:
Framework v2 deployment is failing. What should I do?

Question 3:
Is there a deployment guide for Framework v2?

                    ↓

          Recurring Question
```

Recurring questions are candidates for creating permanent community knowledge.

---

## 4. FAQ Draft Generation

A recurring question can be converted into an FAQ draft.

The workflow is:

```text
Recurring Question
        ↓
Select "Add FAQ"
        ↓
Backend retrieves relevant memory
        ↓
FAQ draft is generated
        ↓
FAQ enters DRAFT state
        ↓
Review
        ↓
Approve
        ↓
Publish
```

---

## 5. Interventions

The system supports interventions designed to reduce recurring community problems.

An intervention can represent an action such as:

* publishing an FAQ,
* posting a deployment guide,
* communicating a solution,
* creating documentation,
* or providing targeted community guidance.

---

## 6. Outcome Measurement

An intervention is not considered successful merely because it was published.

Community Time Machine can measure what happens afterward.

For example:

```text
Before intervention
        ↓
Many deployment questions
        ↓
Publish deployment FAQ
        ↓
Observe next 7 days
        ↓
Measure recurring questions
        ↓
Compare outcome
```

This creates a feedback loop:

```text
Problem
  ↓
Intervention
  ↓
Outcome
  ↓
Learning
  ↓
Improved future intervention
```

---

# Architecture

The project is divided into three major layers.

## Frontend Layer

The frontend is responsible for:

* displaying community information,
* presenting recurring questions,
* managing the FAQ workflow,
* displaying investigations,
* showing interventions,
* displaying outcomes,
* maintaining temporary workflow state,
* communicating with the backend API.

Technology:

* Next.js
* React
* TypeScript

---

## Backend Layer

The backend contains the application logic.

Responsibilities include:

* API endpoints
* retrieval
* memory interaction
* FAQ generation
* recurring-question processing
* evidence collection
* intervention management
* outcome measurement

Technology:

* Python
* FastAPI

---

## Memory Layer

The memory layer uses **Hindsight** to provide persistent AI memory.

The two important concepts are:

### Retain

Store information in memory.

```text
Community information
        ↓
      Retain
        ↓
Persistent memory
```

### Recall

Retrieve relevant information.

```text
Current question
        ↓
      Recall
        ↓
Relevant historical knowledge
```

This allows the backend to combine current requests with previous community knowledge.

---

# Project Flow

The complete system can be represented as:

```text
                     ┌───────────────┐
                     │   Community   │
                     │    Data       │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │   Hindsight   │
                     │    Memory     │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │    Recall     │
                     │  Historical   │
                     │   Context     │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │    Current    │
                     │    Issue      │
                     └───────┬───────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │ Recurring Question?   │
                 └───────────┬───────────┘
                             │
                             ▼
                     ┌───────────────┐
                     │   FAQ Draft   │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │    Review     │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │    Publish    │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Intervention  │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │    Outcome    │
                     └───────┬───────┘
                             │
                             ▼
                     ┌───────────────┐
                     │ Learn / Store │
                     │    Result     │
                     └───────────────┘
```

---

# Technology Stack

| Layer               | Technology                 |
| ------------------- | -------------------------- |
| Frontend            | Next.js                    |
| UI                  | React                      |
| Language            | TypeScript                 |
| Backend             | Python                     |
| API Framework       | FastAPI                    |
| Memory              | Hindsight                  |
| HTTP communication  | REST / JSON                |
| Frontend state      | React state + localStorage |
| Backend environment | Python virtual environment |
| Package management  | npm + pip                  |

The frontend currently uses a Next.js 16 / React 19 setup.

---

# Project Structure

A typical project layout is:

```text
Community-Time-Machine/
│
├── frontend/
│   │
│   ├── app/
│   │   ├── page.tsx
│   │   ├── recurring-questions/
│   │   ├── investigations/
│   │   ├── interventions/
│   │   └── ...
│   │
│   ├── components/
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── types.ts
│   │   └── workflow.ts
│   │
│   ├── public/
│   │
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
│
├── backend/
│   │
│   ├── hindsight_client.py
│   ├── retrieval.py
│   ├── faq_agent.py
│   ├── memory.py
│   ├── evidence.py
│   ├── outcomes.py
│   ├── recurring_questions.py
│   └── ...
│
├── .env
├── requirements.txt
└── README.md
```

> The exact directory names can vary depending on how the project is checked out. The important separation is between the Next.js frontend and Python/FastAPI backend.

---

# Prerequisites

Install the following before running the project.

## Node.js

Node.js is required for the Next.js frontend.

Verify:

```bash
node --version
npm --version
```

---

## Python

Python is required for the backend.

Verify:

```bash
python --version
```

Python 3.10+ is recommended.

---

## Hindsight

The backend requires access to the Hindsight memory service used by the project.

Make sure the Hindsight service is running and that the backend environment variables point to it.

---

# Installation

Clone the project:

```bash
git clone <repository-url>
cd Community-Time-Machine
```

---

# Backend Setup

Navigate to the backend/project root:

```bash
cd Community-Time-Machine
```

Create a virtual environment:

### Windows

```powershell
python -m venv .venv
```

Activate it:

```powershell
.venv\Scripts\activate
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install Python dependencies:

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file in the backend/project root.

Example:

```env
HINDSIGHT_BASE_URL=http://localhost:<hindsight-port>
```

Add any additional API keys or service configuration required by the project's backend implementation.

### Important

Do not commit secrets to Git.

Add sensitive files such as:

```text
.env
.venv/
__pycache__/
node_modules/
```

to `.gitignore`.

---

# Frontend Setup

Open another terminal.

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:3000
```

---

# Running the Project

You generally need three components running:

```text
Terminal 1
──────────
Hindsight


Terminal 2
──────────
FastAPI backend


Terminal 3
──────────
Next.js frontend
```

---

## Start Backend

From the backend/project directory, start FastAPI using the project's configured application module.

For example:

```bash
uvicorn main:app --reload --port 8000
```

If the application entry point has a different filename, use that module instead.

The backend should then be accessible at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is normally available at:

```text
http://127.0.0.1:8000/docs
```

---

## Start Frontend

From `frontend/`:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Frontend

The frontend is implemented using Next.js, React, and TypeScript.

Its responsibility is primarily presentation and workflow orchestration.

The frontend should not contain the core AI/memory logic.

Instead:

```text
Frontend
   ↓
API request
   ↓
FastAPI
   ↓
Business logic
   ↓
Hindsight
```

---

# Frontend API Layer

Frontend API calls are centralized in:

```text
frontend/lib/api.ts
```

This keeps API communication separate from UI components.

A page should generally call an API helper instead of constructing HTTP requests repeatedly throughout the UI.

Conceptually:

```text
React Component
      ↓
    api.ts
      ↓
FastAPI endpoint
```

This makes the frontend easier to maintain when backend endpoints change.

---

# Frontend Type Definitions

Shared frontend data structures are maintained in:

```text
frontend/lib/types.ts
```

Types include concepts such as:

* Event
* Message
* Issue
* Investigation
* Insight
* FAQ
* Outcome
* RecurringQuestion

This gives the frontend compile-time type safety.

---

# Workflow State

The frontend maintains the state of the community intervention workflow.

The workflow contains concepts such as:

```text
selectedQuestion
selectedIssueId
faqId
faqStatus
publishedChannel
interventionId
```

The FAQ status can move through states such as:

```text
DRAFT
   ↓
APPROVED
   ↓
PUBLISHED
```

Other possible states include:

```text
REJECTED
```

---

# Local Storage

The frontend workflow state is persisted in browser `localStorage`.

The workflow storage key is:

```text
community-time-machine-workflow
```

This allows the frontend workflow to survive page navigation and refreshes.

If the browser contains stale workflow state, it can be reset from the browser console:

```javascript
localStorage.removeItem("community-time-machine-workflow")
```

Then reload the application.

---

# Hindsight Memory Layer

Hindsight provides the persistent memory functionality used by the backend.

The application uses memory in two fundamental ways.

## Retain

Information can be stored for future retrieval.

Conceptually:

```text
New community information
        ↓
      Retain
        ↓
Hindsight memory
```

---

## Recall

When a new question arrives, the backend can retrieve relevant historical information.

```text
Current question
        ↓
      Recall
        ↓
Historical community context
```

The retrieved information can then be used for:

* answering questions,
* generating FAQ drafts,
* identifying recurring issues,
* providing evidence,
* evaluating interventions.

---

# Backend Components

## `hindsight_client.py`

Provides the application-level interface to the Hindsight service.

Its responsibility is to isolate Hindsight-specific communication from the rest of the backend.

Conceptually:

```text
Application
     ↓
HindsightClient
     ↓
Hindsight API
```

This abstraction makes it easier for other backend components to use memory without directly managing HTTP details.

---

## `retrieval.py`

Handles retrieval-related logic.

Its purpose is to obtain relevant historical information for a current query or workflow.

Conceptually:

```text
Question
   ↓
Retrieval
   ↓
Relevant memories
   ↓
Evidence / context
```

---

## `memory.py`

Contains memory-related application logic.

This layer helps coordinate the application's interaction with persistent community knowledge.

---

## `faq_agent.py`

Responsible for FAQ-related AI processing.

It can use retrieved historical context to produce a structured FAQ draft.

Conceptually:

```text
Recurring Question
       ↓
Retrieve context
       ↓
FAQ Agent
       ↓
FAQ Draft
```

---

## `evidence.py`

Handles supporting information used during the workflow.

Evidence is important because an FAQ or intervention should be based on relevant community information rather than an unsupported response.

---

## `recurring_questions.py`

Contains logic related to identifying and processing recurring questions.

The recurring-question workflow is:

```text
Community questions
       ↓
Analyze repetition
       ↓
Identify recurring issue
       ↓
Display in frontend
```

---

## `outcomes.py`

Handles measuring the result of an intervention.

For example, an intervention may be evaluated over a defined time window.

A seven-day measurement can conceptually look like:

```text
Intervention
     ↓
7-day observation window
     ↓
Collect relevant questions
     ↓
Measure change
     ↓
Outcome
```

---

# Core Workflows

# Workflow 1 — Discover a Recurring Question

```text
1. Community questions are available
2. Backend analyzes recurring patterns
3. Recurring question is identified
4. Frontend displays the question
5. User selects the recurring question
```

---

# Workflow 2 — Create an FAQ

```text
Recurring Questions
        ↓
Select question
        ↓
Add FAQ
        ↓
POST /faqs/draft
        ↓
Retrieve historical memory
        ↓
Generate FAQ
        ↓
FAQ status = DRAFT
```

---

# Workflow 3 — Review and Publish

```text
FAQ DRAFT
   ↓
Review
   ↓
Approve
   ↓
Publish
   ↓
Intervention created
```

The frontend tracks the associated identifiers and status so that the workflow remains connected across pages.

---

# Workflow 4 — Measure Intervention

```text
Published intervention
        ↓
Wait / observe
        ↓
Outcome measurement
        ↓
Compare relevant activity
        ↓
Outcome generated
```

---

# API Endpoints

The backend exposes REST endpoints for the application workflow.

The exact available routes can always be inspected through FastAPI's Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

Important workflow endpoints include the following.

---

## Create FAQ Draft

### Endpoint

```http
POST /faqs/draft
```

### Request

```json
{
  "question": "How do I deploy with Framework v2?"
}
```

### Example

```bash
python -c "import requests; r=requests.post('http://127.0.0.1:8000/faqs/draft', json={'question':'How do I deploy with Framework v2?'}); print(r.status_code); print(r.text)"
```

The backend should retrieve relevant information and create an FAQ draft.

---

# Measure Intervention Outcome

### Endpoint

```http
POST /interventions/{intervention_id}/outcome
```

### Request

```json
{
  "query": "deployment complaints Framework v2",
  "window_days": 7
}
```

### Example

```bash
python -c "import requests; intervention_id='YOUR_INTERVENTION_ID'; r=requests.post(f'http://127.0.0.1:8000/interventions/{intervention_id}/outcome', json={'query':'deployment complaints Framework v2','window_days':7}); print('STATUS:', r.status_code); print(r.text)"
```

A successful request should return an HTTP `200` response when the backend is correctly configured and the intervention exists.

---

# API Development Pattern

The general backend architecture follows:

```text
HTTP Request
     ↓
FastAPI Route
     ↓
Application Logic
     ↓
Retrieval / Agent / Memory
     ↓
Hindsight
     ↓
Response
     ↓
Frontend
```

The frontend should not directly communicate with Hindsight.

Instead:

```text
Frontend → Backend → Hindsight
```

This keeps the memory service behind the application's API boundary.

---

# FAQ Workflow

The FAQ workflow is one of the primary features of Community Time Machine.

## Step 1 — Find recurring question

Navigate to:

```text
/recurring-questions
```

The page displays recurring questions identified by the system.

---

## Step 2 — Select question

Choose the question that should become permanent community knowledge.

---

## Step 3 — Add FAQ

Click:

```text
Add FAQ
```

The frontend sends a request to:

```http
POST /faqs/draft
```

---

## Step 4 — Generate draft

The backend:

1. receives the question,
2. retrieves relevant community memory,
3. gathers supporting context,
4. generates the FAQ,
5. returns the FAQ information.

---

## Step 5 — Review

The generated FAQ enters:

```text
DRAFT
```

A reviewer can inspect the content before publication.

---

## Step 6 — Approve

After review:

```text
DRAFT → APPROVED
```

---

## Step 7 — Publish

The approved FAQ can be published.

The workflow records the publication channel and associated intervention.

---

# Recurring Questions

Recurring questions represent community problems that appear repeatedly.

A recurring question should not simply be treated as a count.

It is a signal that:

> A permanent piece of knowledge may be more useful than repeatedly answering the same question.

For example:

```text
Repeated question
       ↓
Recurring pattern
       ↓
FAQ candidate
       ↓
Permanent documentation
```

This is one of the main mechanisms by which the project converts community conversation into institutional memory.

---

# Interventions

An intervention represents an action taken in response to a recurring community problem.

Examples include:

* publishing an FAQ,
* publishing documentation,
* communicating a known solution,
* providing targeted guidance.

The important relationship is:

```text
Issue
 ↓
Intervention
 ↓
Outcome
```

This makes it possible to connect an action to its measurable result.

---

# Outcomes

An outcome describes what happened after an intervention.

For example:

```text
Before:
Many questions about Framework v2 deployment

Intervention:
Publish deployment FAQ

Observation window:
7 days

After:
Measure deployment-related questions
```

The goal is not simply to publish more content.

The system attempts to determine whether the intervention changed the community's behavior.

---

# Example End-to-End Scenario

Suppose a community repeatedly asks:

> How do I deploy with Framework v2?

The system processes it as follows.

### 1. Question appears

```text
How do I deploy with Framework v2?
```

### 2. Memory retrieval

The backend searches historical community memory.

```text
Recall:
- Previous deployment discussion
- Known configuration issue
- Previous solution
- Related questions
```

### 3. Recurring question detected

The system identifies deployment with Framework v2 as a recurring topic.

### 4. FAQ generated

```text
FAQ:
How do I deploy with Framework v2?
```

The FAQ contains information derived from relevant historical context.

### 5. FAQ approved

```text
DRAFT → APPROVED
```

### 6. FAQ published

The publication becomes an intervention.

### 7. Outcome measured

After the selected observation window, the system examines relevant activity.

```text
Intervention
     ↓
Observe community
     ↓
Measure recurring activity
     ↓
Outcome
```

### 8. Knowledge loop continues

The outcome can become part of the system's broader community memory.

---

# Troubleshooting

## `npm` says `package.json` cannot be found

Example error:

```text
npm error ENOENT
npm error Could not read package.json
```

This usually means npm was executed from the wrong directory.

If the frontend contains `package.json`, navigate into it first:

```powershell
cd frontend
npm install
npm run dev
```

Check that:

```powershell
dir package.json
```

actually finds the file.

---

# Backend Is Not Running

Check:

```text
http://127.0.0.1:8000/docs
```

If it does not open, start the FastAPI application.

For example:

```bash
uvicorn main:app --reload --port 8000
```

Use the actual backend entry-point module if it differs.

---

# Frontend Cannot Reach Backend

Check that:

```text
Frontend
http://localhost:3000
```

and:

```text
Backend
http://127.0.0.1:8000
```

are both running.

Then inspect the browser's developer console and Network tab.

Common causes include:

* backend not running,
* incorrect API base URL,
* incorrect endpoint,
* CORS configuration,
* wrong port,
* stale frontend state.

---

# FAQ Draft Request Fails

Test the backend directly:

```bash
python -c "import requests; r=requests.post('http://127.0.0.1:8000/faqs/draft', json={'question':'How do I deploy with Framework v2?'}); print('STATUS:', r.status_code); print('BODY:', r.text)"
```

If this request fails, the problem is in the backend or its dependencies rather than the frontend.

Check:

1. FastAPI is running.
2. Hindsight is running.
3. Environment variables are configured.
4. Required Python packages are installed.
5. The FAQ endpoint is registered.
6. Backend logs for the exact exception.

---

# Stale Workflow State

If the frontend displays an old FAQ ID, intervention ID, or status, reset the workflow state.

Open the browser developer console and run:

```javascript
localStorage.removeItem("community-time-machine-workflow")
```

Then refresh the page.

Navigate back to:

```text
/recurring-questions
```

and start the workflow again.

---

# Hindsight Connection Problems

If memory retrieval or retention fails:

1. Verify Hindsight is running.
2. Verify the Hindsight base URL.
3. Check `.env`.
4. Restart the backend after changing environment variables.
5. Check backend logs.
6. Test the Hindsight connection independently if the project provides a health endpoint.

The architecture requires:

```text
Backend
   ↓
Hindsight
```

so the backend cannot perform memory-dependent workflows when Hindsight is unavailable.

---

# CORS Problems

If the browser reports a CORS error, verify that the backend allows requests from the frontend development origin.

During development, the frontend normally runs on:

```text
http://localhost:3000
```

while the backend runs on:

```text
http://127.0.0.1:8000
```

The backend's CORS configuration should permit the frontend origin where appropriate.

---

# Development Guidelines

## Keep frontend and backend responsibilities separate

Do not move memory logic into React components.

Prefer:

```text
React
 ↓
API
 ↓
FastAPI
 ↓
Memory
```

instead of:

```text
React
 ↓
Hindsight directly
```

---

## Centralize API calls

Use:

```text
frontend/lib/api.ts
```

for backend communication.

This prevents API URLs and request logic from being duplicated across components.

---

## Keep types synchronized

When changing backend response structures, update the corresponding TypeScript types in:

```text
frontend/lib/types.ts
```

---

## Keep workflow state consistent

When changing the FAQ or intervention workflow, make sure all related fields are updated together.

For example:

```text
FAQ ID
FAQ Status
Published Channel
Intervention ID
```

should represent the same workflow instance.

---

## Test the backend independently

Before debugging the frontend, test the API directly.

For example:

```bash
POST /faqs/draft
```

If the API works directly but the frontend fails, the issue is likely in:

* API integration,
* frontend state,
* routing,
* request formatting,
* or browser configuration.

---

# Recommended Development Sequence

When modifying the project, use this order:

```text
1. Understand the backend API
          ↓
2. Test API directly
          ↓
3. Update TypeScript types
          ↓
4. Update API helper
          ↓
5. Update React component
          ↓
6. Test complete workflow
          ↓
7. Test refresh/localStorage behavior
```

This makes debugging considerably easier.

---

# Testing Checklist

Before considering a workflow complete, verify:

### Backend

* [ ] Backend starts successfully
* [ ] `/docs` is accessible
* [ ] Hindsight connection works
* [ ] Retrieval works
* [ ] FAQ draft endpoint works
* [ ] Intervention endpoint works
* [ ] Outcome measurement works

### Frontend

* [ ] Next.js starts successfully
* [ ] Dashboard loads
* [ ] Recurring questions load
* [ ] FAQ can be created
* [ ] FAQ status updates correctly
* [ ] Intervention ID is preserved
* [ ] Outcome can be requested
* [ ] Workflow survives navigation
* [ ] Stale localStorage can be reset

### End-to-End

* [ ] Recurring question appears
* [ ] FAQ draft is generated
* [ ] FAQ enters DRAFT state
* [ ] FAQ can be approved
* [ ] FAQ can be published
* [ ] Intervention is created
* [ ] Outcome can be measured

---

# Security Considerations

Do not commit:

```text
.env
API keys
access tokens
private credentials
```

Never expose Hindsight credentials in frontend code.

Sensitive configuration belongs on the backend.

The frontend should communicate with the backend through the application's API.

---

# Git Workflow

A recommended workflow is:

```bash
git status
git add .
git commit -m "Describe the change"
git push
```

Before committing, verify that generated or sensitive files are excluded.

Useful files to keep out of Git include:

```text
.env
.venv/
__pycache__/
node_modules/
.next/
```

---

# Future Improvements

Potential extensions include:

## Automated Community Ingestion

Automatically ingest messages from supported community platforms.

```text
Discord / Community Platform
          ↓
       Ingestion
          ↓
       Hindsight
```

---

## Better Recurrence Detection

Use more advanced clustering and semantic similarity to identify recurring issues.

---

## Automated FAQ Evaluation

Evaluate FAQ quality against:

* retrieved evidence,
* historical answers,
* resolution rate,
* subsequent community activity.

---

## Richer Outcome Metrics

Track:

* number of repeated questions,
* time between repeated questions,
* engagement with published FAQs,
* issue recurrence,
* resolution rate.

---

## Continuous Learning

Feed intervention outcomes back into memory so that future interventions can use previous results.

```text
Historical Data
      ↓
Memory
      ↓
Intervention
      ↓
Outcome
      ↓
Memory
      ↓
Better Future Intervention
```

---

# Design Philosophy

Community Time Machine is based on four principles.

## 1. Remember

Important community knowledge should not disappear.

## 2. Reuse

Previous solutions should be reusable when similar problems appear.

## 3. Intervene

Recurring problems should trigger useful actions rather than repeated manual answers.

## 4. Measure

An intervention should be evaluated based on what happens afterward.

Together:

```text
REMEMBER
   ↓
REUSE
   ↓
INTERVENE
   ↓
MEASURE
   ↓
LEARN
   ↓
REMEMBER
```

This creates the **Community Time Machine loop**.

---

# Summary

Community Time Machine is a full-stack community intelligence application built around persistent AI memory.

Its architecture is:

```text
┌─────────────────────┐
│     Next.js         │
│ React + TypeScript  │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│      FastAPI        │
│      Python         │
└──────────┬──────────┘
           │
           ├───────────────┐
           │               │
           ▼               ▼
┌─────────────────┐  ┌─────────────────┐
│ Retrieval / AI  │  │ Workflow Logic  │
│     Agents      │  │ FAQ / Outcomes  │
└────────┬────────┘  └─────────────────┘
         │
         ▼
┌─────────────────────┐
│      Hindsight      │
│ Persistent Memory   │
└─────────────────────┘
```

The complete knowledge lifecycle is:

```text
Community Conversation
          ↓
       Memory
          ↓
      Retrieval
          ↓
Recurring Question
          ↓
      FAQ Draft
          ↓
       Review
          ↓
       Publish
          ↓
    Intervention
          ↓
      Outcome
          ↓
       Learning
          ↓
       Memory
```

Community Time Machine therefore moves beyond simply **storing community conversations**.

It creates a system where community history can be retrieved, transformed into reusable knowledge, turned into interventions, and evaluated over time.
