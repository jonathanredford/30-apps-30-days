import { App } from "./types";

export const CHALLENGE_START = "2026-03-30";

export const apps: App[] = [
  {
    day: 1,
    name: "App tracker",
    description:
      "A dashboard to track and publicly showcase this 30-day challenge.",
    stack: "Next.js, Tailwind",
    liveUrl: "https://day01.slopp.co",
    githubPath: "apps/day-01-tracker",
    timeToShip: "",
    learned:
      "AI makes mistakes — you need experience to spot them. Easy to disengage from the process and miss flaws. Best used for getting an MVP out fast while you stay focused on the outcome, then iterate from there.",
    status: "shipped",
  },
  {
    day: 2,
    name: "AI Code Reviewer",
    description:
      "Paste code and get an instant streaming review from Claude. Detects language, flags issues, and scores severity.",
    stack: "Next.js 16, Tailwind, Anthropic SDK",
    liveUrl: "https://day02.slopp.co",
    githubPath: "apps/day-02-ai-code-reviewer",
    timeToShip: "",
    learned:
      "Streaming UX changes the feel of an app entirely — users tolerate latency when they see progress. Structuring AI output (severity, headline, points) makes it far more scannable than a wall of text.",
    status: "shipped",
  },
  {
    day: 3,
    name: "Voice Journal",
    description:
      "Record your voice, get a transcript via Whisper, and extract themes and action items with Claude.",
    stack: "Next.js 16, Tailwind, OpenAI Whisper, Anthropic SDK",
    liveUrl: "https://day03.slopp.co",
    githubPath: "apps/day-03-voice-journal",
    timeToShip: "",
    learned:
      "Browser MediaRecorder APIs are messier than expected — MIME type negotiation, permission UX, and blob assembly all need explicit handling. Demo mode is essential when API keys are personal and the app is public.",
    status: "shipped",
  },
  { day: 4, status: "upcoming" },
  { day: 5, status: "upcoming" },
  { day: 6, status: "upcoming" },
  { day: 7, status: "upcoming" },
  { day: 8, status: "upcoming" },
  { day: 9, status: "upcoming" },
  { day: 10, status: "upcoming" },
  { day: 11, status: "upcoming" },
  { day: 12, status: "upcoming" },
  { day: 13, status: "upcoming" },
  { day: 14, status: "upcoming" },
  { day: 15, status: "upcoming" },
  { day: 16, status: "upcoming" },
  { day: 17, status: "upcoming" },
  { day: 18, status: "upcoming" },
  { day: 19, status: "upcoming" },
  { day: 20, status: "upcoming" },
  { day: 21, status: "upcoming" },
  { day: 22, status: "upcoming" },
  { day: 23, status: "upcoming" },
  { day: 24, status: "upcoming" },
  { day: 25, status: "upcoming" },
  { day: 26, status: "upcoming" },
  { day: 27, status: "upcoming" },
  { day: 28, status: "upcoming" },
  { day: 29, status: "upcoming" },
  { day: 30, status: "upcoming" },
];
