import Anthropic from '@anthropic-ai/sdk'
import { Answer } from '@/lib/types'
import { SKIP_SECTIONS } from '@/lib/constants'

const anthropic = new Anthropic()

const SYSTEM_PROMPTS: Record<string, string> = {
  challenger:
    "You are a tough, direct decision coach. Push back hard on assumptions. Don't validate — interrogate. Use the follow-up answers to identify what the user might be avoiding or rationalising.",
  strategist:
    "You are a structured analytical coach. Use frameworks. Be direct with a recommendation. Lay out the trade-offs clearly and conclude with a definitive lean.",
  speedrun:
    "You are a no-nonsense coach. Be brief. One paragraph per section max. Get to the point.",
  therapist:
    "You are a gentle, reflective coach. Prioritise feelings and underlying needs. Don't push a recommendation — help the user hear themselves think.",
  devil:
    "You are a contrarian coach. Argue the opposite of wherever the user seems to be leaning. Surface the strongest case for the road not taken.",
}

const ALL_SECTIONS = [
  "## The situation",
  "## What's actually at stake",
  "## Pros / cons",
  "## What you might be avoiding",
  "## Recommended lean",
  "## The question to sit with",
]

export async function POST(request: Request) {
  const { decision, style, answers }: { decision: string; style: string; answers: Answer[] } =
    await request.json()

  const skip = SKIP_SECTIONS[style] ?? []
  const sections = ALL_SECTIONS.filter((s) => !skip.includes(s))
  const systemPrompt = SYSTEM_PROMPTS[style] ?? SYSTEM_PROMPTS.strategist

  const answersText =
    answers.length > 0
      ? '\n\nFollow-up answers:\n' + answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n')
      : ''

  const userMessage =
    `Decision: ${decision}${answersText}\n\n` +
    `Please provide your coaching breakdown using these exact section headings in this order:\n` +
    sections.join('\n')

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = anthropic.messages.stream({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        })

        for await (const event of messageStream) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (error) {
        const msg = error instanceof Error ? error.message : 'An error occurred'
        controller.enqueue(encoder.encode(`Error: ${msg}`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  })
}
