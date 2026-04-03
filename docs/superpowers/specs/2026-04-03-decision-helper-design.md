# Decision Helper — Design Spec
**Date:** 2026-04-03
**App:** Day 05 — `apps/day-05-decision-helper`

---

## Overview

A two-step AI decision coaching tool. The user picks a coaching style, describes their decision, optionally answers follow-up questions, and receives a streamed breakdown tailored to the chosen style.

---

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS
- Google Font: DM Sans (300, 400, 500)
- Accent: `#3C3489` (dark purple), tint: `#EEEDFE`
- `vercel.json` at app root: `{ "framework": "nextjs" }`
- File layout: Day 04 pattern — no `src/` prefix, flat `app/` / `components/` / `hooks/` / `lib/`

---

## Step Flow

| Step | View | Advance condition |
|------|------|-------------------|
| 1 | StyleGrid | Tap a style card → immediately advance |
| 2 | DecisionInput | "Get my questions →" CTA → POST `/api/questions` |
| 3 | QuestionCards | "Get my breakdown →" or "Skip questions" → POST `/api/breakdown` |
| 4 | BreakdownView | Streamed output; no further navigation |

---

## Coaching Styles

```ts
const STYLES = [
  { id: 'challenger', icon: '🔥', name: 'Challenger',         desc: 'Pushes back on your assumptions' },
  { id: 'strategist', icon: '📊', name: 'Strategist',         desc: 'Structured with a clear recommendation' },
  { id: 'speedrun',   icon: '⚡', name: 'Speed run',          desc: 'Fast answer, minimal fuss' },
  { id: 'therapist',  icon: '🌿', name: 'Therapist',          desc: 'Gentle and reflective' },
  { id: 'devil',      icon: '😈', name: "Devil's advocate",   desc: 'Argues the opposite' },
]
```

---

## File Structure

```
apps/day-05-decision-helper/
  app/
    layout.tsx              — DM Sans font, metadata
    page.tsx                — server component; derives isDemo; passes to HomeClient
    HomeClient.tsx          — client orchestrator; renders step 1–4 views
    globals.css
    api/
      questions/route.ts    — POST, JSON response
      breakdown/route.ts    — POST, ReadableStream
  components/
    StyleGrid.tsx           — 5 style cards, single-select, tap-to-advance
    DecisionInput.tsx       — textarea + char count + CTA
    QuestionCard.tsx        — single question: chips + free-text
    BreakdownView.tsx       — streamed markdown sections renderer
    StepIndicator.tsx       — 4-dot progress indicator with labels
    DemoCursor.tsx          — animated demo cursor (reuse Day 02/04 pattern)
  hooks/
    useDecisionFlow.ts      — all app state; step transitions; questions API call
    useBreakdownStream.ts   — streaming logic; mirrors useCodeReview pattern
  lib/
    constants.ts            — STYLES, SECTION_LABELS, per-style section skip rules
    types.ts                — DecisionStyle, Question, Answer
    demoData.ts             — mock questions + mock breakdown text
  vercel.json
```

---

## State

### useDecisionFlow
```ts
// State
step: 1 | 2 | 3 | 4
style: string                         // coaching style id
decision: string                      // free-text decision description
questions: { question: string; options: string[] }[]
answers: { question: string; answer: string }[]
isLoadingQuestions: boolean
error: string | null

// Actions
setStyle(id: string): void            // also advances step 1 → 2
setDecision(text: string): void
submitQuestions(): Promise<void>      // calls /api/questions; advances to step 3
setAnswer(index: number, answer: string): void
submitBreakdown(): void               // advances to step 4, triggers stream
skipToBreakdown(): void               // advances to step 4 with empty answers
```

### useBreakdownStream
```ts
// State
breakdown: string       // accumulated streamed text
isStreaming: boolean
error: string | null

// Actions
stream(payload: { decision: string; style: string; answers: Answer[] }): void
stop(): void
```

---

## API Routes

### POST /api/questions
**Request:** `{ decision: string, style: string }`

**Prompt:**
> You are a `{style}` decision coach. The user is facing this decision: `{decision}`. Generate `{n}` follow-up questions that will sharpen your analysis. For each question, also generate exactly 3 short pre-canned answer options that reflect realistic responses. Respond only in JSON. Format: `[{ "question": string, "options": [string, string, string] }]`. For Speed Run style, return 1 question only. For all others, return 3.

**Response:** `{ questions: [{ question: string, options: string[] }] }`

---

### POST /api/breakdown (streaming)
**Request:** `{ decision: string, style: string, answers: { question: string, answer: string }[] }`

**System prompts per style:**

- **Challenger:** Tough, direct. Push back hard on assumptions. Interrogate, don't validate.
- **Strategist:** Structured analytical. Use frameworks. Direct recommendation with clear trade-offs.
- **Speed Run:** No-nonsense. Brief — one paragraph per section max.
- **Therapist:** Gentle, reflective. Prioritise feelings and underlying needs. No push for a recommendation.
- **Devil's Advocate:** Contrarian. Argue the opposite. Surface the strongest case for the road not taken.

**Output sections:**

| Section | Skip for |
|---------|----------|
| `## The situation` | — |
| `## What's actually at stake` | — |
| `## Pros / cons` | Therapist |
| `## What you might be avoiding` | Speed Run |
| `## Recommended lean` | Therapist |
| `## The question to sit with` | — |

**Streaming implementation:** `ReadableStream` / `for await` on server; `response.body.getReader()` + `TextDecoder({ stream: true })` + `AbortController` on client.

---

## Component Specs

### StyleGrid
- 5 cards in a responsive grid (2-col mobile, 5-col desktop)
- Each card: icon, name, desc
- Active state: `border-2 border-[#3C3489] bg-[#EEEDFE]`
- Tap immediately calls `setStyle()` which advances step

### DecisionInput
- `<textarea>` with char count below
- CTA: "Get my questions →" (`bg-[#3C3489] text-[#EEEDFE]`)
- Disabled while `isLoadingQuestions`

### QuestionCard
- Question text (font-weight 500, 14px)
- 3 vertically-stacked chip buttons (pre-canned options)
  - Selected: `border-2 border-[#3C3489] bg-[#EEEDFE]`
  - Selecting a chip clears the textarea
- "or write your own" label + free-text textarea below
  - Typing clears the selected chip
- Question counter top-right: `"2 / 3"`

### BreakdownView
- Renders accumulated `breakdown` string
- Splits on `## ` to identify sections as they arrive
- Each section: labelled heading + body text
- Shows a loading skeleton or spinner before first chunk

### StepIndicator
- 4 dots + labels: Choose style / Describe it / Answer questions / Get your breakdown
- Active step dot: `#534AB7`
- Completed steps: filled/dimmed

---

## Demo Mode

- Triggered when `ANTHROPIC_API_KEY` is not set (checked server-side in `page.tsx`, passed as `isDemo` prop)
- `/api/questions` returns mock questions immediately
- `/api/breakdown` returns mock breakdown text streamed character-by-character via `setInterval`
- `DemoCursor` animates over the UI (reuse Day 02/04 pattern)

---

## UI Tokens

| Token | Value |
|-------|-------|
| Background | `bg-gray-50` / `bg-neutral-50` |
| Cards | `bg-white rounded-xl border border-gray-200` |
| Primary button | `bg-[#3C3489] text-[#EEEDFE]` |
| Active/selected | `border-2 border-[#3C3489] bg-[#EEEDFE]` |
| Step indicator active | `#534AB7` |
