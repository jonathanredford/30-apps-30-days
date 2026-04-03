import { DecisionStyle } from './types'

export const STYLES: DecisionStyle[] = [
  { id: 'challenger', icon: '🔥', name: 'Challenger',        desc: 'Pushes back on your assumptions' },
  { id: 'strategist', icon: '📊', name: 'Strategist',        desc: 'Structured with a clear recommendation' },
  { id: 'speedrun',   icon: '⚡', name: 'Speed run',         desc: 'Fast answer, minimal fuss' },
  { id: 'therapist',  icon: '🌿', name: 'Therapist',         desc: 'Gentle and reflective' },
  { id: 'devil',      icon: '😈', name: "Devil's advocate",  desc: 'Argues the opposite' },
]

export const STYLE_LABELS: Record<string, string> = {
  challenger: 'Challenger',
  strategist: 'Strategist',
  speedrun:   'Speed Run',
  therapist:  'Therapist',
  devil:      "Devil's Advocate",
}

// Sections to omit per style
export const SKIP_SECTIONS: Record<string, string[]> = {
  therapist: ['## Pros / cons', '## Recommended lean'],
  speedrun:  ['## What you might be avoiding'],
}

// Number of questions to request
export const QUESTION_COUNT: Record<string, number> = { speedrun: 1 }
export const DEFAULT_QUESTION_COUNT = 3
