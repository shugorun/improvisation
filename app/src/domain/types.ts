export type Move = 0 | 1 // 0 = Left, 1 = Right

export type ModelId = 'ngram' | 'markov1' | 'frequency'

export interface Prediction {
  guess: Move | null // null = no basis yet (caller falls back to a coin flip)
  confidence: number // probability of the guessed side; 0.5 when no basis
  context: Move[] // the recent moves the guess was based on
}

export interface TopContext {
  context: Move[]
  next: Move
  prob: number
  count: number
}

export interface Predictor {
  readonly model: ModelId
  observe(move: Move): void
  predict(): Prediction
  topContexts(limit: number): TopContext[]
}
