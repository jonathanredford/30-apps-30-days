import OpenAI from "openai";

const DEMO_TRANSCRIPT =
  "So today was pretty intense at work. Had three back-to-back meetings in the morning which was exhausting. " +
  "I really need to start blocking out focus time on my calendar before nine AM so I can actually get some deep work done. " +
  "On a positive note, the new feature shipped successfully and the team is really happy with how it turned out. " +
  "I'm also feeling like I need to exercise more — I haven't been to the gym in two weeks and I can feel it affecting my energy levels. " +
  "Need to book a session this week. Also want to reach out to Sarah about the project proposal she mentioned last Thursday.";

export async function POST(req: Request) {
  // In production, return a canned response so personal API keys aren't exposed to public use
  if (process.env.NODE_ENV !== "development") {
    await new Promise((r) => setTimeout(r, 1200));
    return Response.json({ transcript: DEMO_TRANSCRIPT });
  }

  const openai = new OpenAI();
  const formData = await req.formData();
  const audioFile = formData.get("audio") as File | null;

  if (!audioFile) {
    return Response.json({ error: "No audio file provided" }, { status: 400 });
  }

  const file = new File([audioFile], "audio.webm", { type: audioFile.type || "audio/webm" });

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });

  return Response.json({ transcript: transcription.text });
}
