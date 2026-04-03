import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import type { FormState } from "@/lib/types";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const body: FormState = await req.json();
  const { moods, cuisines, time, effort, fridge } = body;

  const prompt = `You are a helpful dinner assistant for a household. Based on the following inputs, suggest 2-3 dinner options.

Mood: ${moods.length > 0 ? moods.join(", ") : "not specified"}
Cuisine vibe: ${cuisines.length > 0 ? cuisines.join(", ") : "not specified"}
Time available: ${time || "not specified"}
Effort level: ${effort || "not specified"}
What's in the fridge: ${fridge || "not specified"}

Return ONLY a valid JSON array with no preamble, markdown, or backticks. Each object must have:
- name: string
- description: string (one punchy sentence)
- cookTime: string (e.g. "25 min")
- effort: string (e.g. "Low effort")
- cuisine: string (e.g. "Italian")
- why: string (one sentence explaining why this fits their inputs)
- ingredients: string (comma-separated list of what they'd still need to buy or grab)
- bestMatch: boolean (true for one item only)

Order results with bestMatch first.`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text : "";

  let meals;
  try {
    meals = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Claude returned invalid JSON. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(meals);
}
