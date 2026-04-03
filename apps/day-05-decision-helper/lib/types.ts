export interface DecisionStyle {
  id: string
  icon: string
  name: string
  desc: string
}

export interface Question {
  question: string
  options: [string, string, string]
}

export interface Answer {
  question: string
  answer: string
}
