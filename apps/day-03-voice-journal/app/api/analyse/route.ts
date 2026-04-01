import Anthropic from "@anthropic-ai/sdk";

const DEMO_RESULT = {
  summary:
    "A productive day with a successful feature launch, but recurring over-scheduling and low energy are flagging a need for better boundaries around focus time and exercise.",
  themes: ["Work", "Focus", "Health", "Team"],
  actionItems: [
    "Block focus time before 9 AM on the calendar",
    "Book a gym session this week",
    "Reach out to Sarah about the project proposal",
  ],
};

export async function POST(req: Request) {
  const { transcript } = await req.json();

  // In production, return a canned response so personal API keys aren't exposed to public use
  if (process.env.NODE_ENV !== "development") {
    await new Promise((r) => setTimeout(r, 1800));
    return Response.json(DEMO_RESULT);
  }

  if (!transcript) {
    return Response.json({ error: "No transcript provided" }, { status: 400 });
  }

  const anthropic = new Anthropic();

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system:
      "You are a journalling assistant. Extract structure from voice journal transcripts. Return ONLY valid JSON with no markdown fences, no explanation, no extra text — just the raw JSON object.",
    messages: [
      {
        role: "user",
        content: `Analyse this voice journal transcript and return a JSON object with exactly this shape:
{ "summary": string, "themes": string[], "actionItems": string[] }

Rules:
- summary: one or two sentences capturing the core of the entry
- themes: 2–5 short theme labels (e.g. "Work", "Health", "Relationships")
- actionItems: concrete next steps mentioned or implied (empty array if none)
- Return ONLY the raw JSON — no markdown, no fences, no explanation

Transcript:
${transcript}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text.trim() : "{}";

  const result = JSON.parse(text);
  return Response.json(result);
}
