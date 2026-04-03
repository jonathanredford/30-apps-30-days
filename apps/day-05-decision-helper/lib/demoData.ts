import { Question } from './types'

export const DEMO_STYLE = 'challenger'

export const DEMO_DECISION =
  "Should I leave my stable job to join an early-stage startup as employee #8?"

export const DEMO_QUESTIONS: Question[] = [
  {
    question: 'How long have you been sitting with this decision?',
    options: ['A few days', 'A few weeks', 'Several months'],
  },
  {
    question: 'What feels most scary about making the wrong choice?',
    options: ['Wasting time or money', 'Disappointing others', 'Missing out on something better'],
  },
  {
    question: 'If you had to decide right now, which way would you lean?',
    options: ["I already know — I just need validation", "I'm genuinely split 50/50", "I lean one way but I'm scared"],
  },
]

export const DEMO_BREAKDOWN = `## The situation
You're weighing whether to leave a stable job for an early-stage startup as employee number 8.

## What's actually at stake
This isn't just a career move — it's a bet on your risk tolerance, your financial runway, and what you want the next chapter to feel like. The startup offers upside and ownership; the stable job offers certainty and optionality. Both have a cost.

## Pros / cons
**For the startup:** Equity at employee #8 is meaningful. You'd have outsized influence on company culture and product direction. The learning curve will be steep and fast.

**Against the startup:** Early-stage means real failure risk. Your income stability disappears. The "excitement" of a startup has a 2am-Slack-message tax that job listings don't advertise.

## What you might be avoiding
There's a version of this where your "stable job" feels safe but actually feels stifling — and the startup is the permission slip you're looking for to leave something you've already mentally quit. Worth sitting with.

## Recommended lean
If your financial runway covers 12 months of worst-case (offer falls through, startup fails fast), and you've met the founders more than twice and respect them, lean in. If either of those conditions isn't met, wait until they are.

## The question to sit with
If the startup fails in 18 months and you're job-hunting again — would you feel like you took a shot, or like you made a mistake?`
