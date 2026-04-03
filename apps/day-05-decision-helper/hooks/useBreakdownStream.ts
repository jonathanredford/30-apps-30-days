'use client'

import { useState, useRef } from 'react'
import { Answer } from '@/lib/types'
import { DEMO_BREAKDOWN } from '@/lib/demoData'

export interface BreakdownStreamState {
  breakdown: string
  isStreaming: boolean
  error: string | null
}

export interface BreakdownStreamActions {
  stream: (payload: { decision: string; style: string; answers: Answer[] }) => Promise<void>
  streamDemo: () => void
  stop: () => void
  reset: () => void
}

export function useBreakdownStream(): BreakdownStreamState & BreakdownStreamActions {
  const [breakdown, setBreakdown] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const demoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stream = async (payload: { decision: string; style: string; answers: Answer[] }) => {
    const ac = new AbortController()
    abortRef.current = ac

    setIsStreaming(true)
    setBreakdown('')
    setError(null)

    try {
      const res = await fetch('/api/breakdown', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        signal: ac.signal,
      })

      if (!res.ok) throw new Error(`Request failed: ${res.statusText}`)

      const reader = res.body!.getReader()
      const decoder = new TextDecoder('utf-8', { fatal: false })

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        setBreakdown((prev) => prev + chunk)
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // intentional cancel
      } else {
        setError(err instanceof Error ? err.message : 'Something went wrong')
      }
    } finally {
      setIsStreaming(false)
    }
  }

  const streamDemo = () => {
    setBreakdown('')
    setError(null)
    setIsStreaming(true)

    let i = 0
    const CHAR_DELAY = 12

    demoTimerRef.current = setInterval(() => {
      i++
      setBreakdown(DEMO_BREAKDOWN.slice(0, i))
      if (i >= DEMO_BREAKDOWN.length) {
        clearInterval(demoTimerRef.current!)
        setIsStreaming(false)
      }
    }, CHAR_DELAY)
  }

  const stop = () => {
    abortRef.current?.abort()
    if (demoTimerRef.current) {
      clearInterval(demoTimerRef.current)
      setIsStreaming(false)
    }
  }

  const reset = () => {
    stop()
    setBreakdown('')
    setError(null)
    setIsStreaming(false)
  }

  return { breakdown, isStreaming, error, stream, streamDemo, stop, reset }
}
