'use client'

import { useState, useEffect } from 'react'
import { Question, Answer } from '@/lib/types'
import { DEMO_STYLE, DEMO_DECISION, DEMO_QUESTIONS } from '@/lib/demoData'

export interface DemoFlowState {
  step: 1 | 2 | 3 | 4
  style: string
  decision: string
  questions: Question[]
  answers: Answer[]
  cursorTarget: string | null
  isCursorClicking: boolean
}

/**
 * Runs an automated looping demo of the full 4-step decision flow.
 * Calls onBreakdown() when it reaches step 4 so HomeClient can trigger
 * the mock breakdown stream.
 */
export function useDemoFlow(enabled: boolean, onBreakdown: () => void): DemoFlowState {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [style, setStyle] = useState('')
  const [decision, setDecision] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Answer[]>([])
  const [cursorTarget, setCursorTarget] = useState<string | null>(null)
  const [isCursorClicking, setIsCursorClicking] = useState(false)
  const [loopCount, setLoopCount] = useState(0)

  useEffect(() => {
    if (!enabled) return

    const timeouts: ReturnType<typeof setTimeout>[] = []
    const at = (delay: number, fn: () => void) => timeouts.push(setTimeout(fn, delay))

    // Reset
    setStep(1)
    setStyle('')
    setDecision('')
    setQuestions([])
    setAnswers([])
    setCursorTarget(null)
    setIsCursorClicking(false)

    let t = 800

    const click = (selector: string, action: () => void) => {
      at(t, () => setCursorTarget(selector))
      t += 700
      at(t, () => setIsCursorClicking(true))
      t += 220
      at(t, () => { setIsCursorClicking(false); action() })
      t += 350
    }

    // Phase 1 — pick a style card
    click(`[data-style="${DEMO_STYLE}"]`, () => {
      setStyle(DEMO_STYLE)
      setStep(2)
    })

    // Phase 2 — type the decision
    at(t, () => setCursorTarget('[data-input="decision"]'))
    t += 700

    const CHAR_DELAY = 22
    DEMO_DECISION.split('').forEach((_, i) => {
      at(t + i * CHAR_DELAY, () => setDecision(DEMO_DECISION.slice(0, i + 1)))
    })
    t += DEMO_DECISION.length * CHAR_DELAY + 600

    // Phase 3 — click "Get my questions →"
    click('[data-cta="get-questions"]', () => {
      const q = DEMO_QUESTIONS
      setQuestions(q)
      setAnswers(q.map((item) => ({ question: item.question, answer: '' })))
      setStep(3)
    })

    t += 400 // brief pause before answering

    // Phase 4 — select first chip for each question
    DEMO_QUESTIONS.forEach((q, qi) => {
      click(`[data-chip="${qi}-0"]`, () => {
        setAnswers((prev) => {
          const next = [...prev]
          next[qi] = { question: q.question, answer: q.options[0] }
          return next
        })
      })
    })

    // Phase 5 — click "Get my breakdown →"
    click('[data-cta="get-breakdown"]', () => {
      setStep(4)
      onBreakdown()
    })

    // Phase 6 — wait and loop
    t += 18000
    at(t, () => setLoopCount((c) => c + 1))

    return () => timeouts.forEach(clearTimeout)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, loopCount])

  return { step, style, decision, questions, answers, cursorTarget, isCursorClicking }
}
