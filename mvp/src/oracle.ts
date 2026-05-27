// Oracle MVP: prediction models (throwaway; the real models are rebuilt in app/).
// Move: 0 = Left, 1 = Right.

export type Move = 0 | 1

export type ModelId = 'frequency' | 'markov1' | 'ngram'

export const MODELS: { id: ModelId; label: string; blurb: string }[] = [
  { id: 'frequency', label: 'Frequency', blurb: 'Predicts whichever side you press more overall.' },
  { id: 'markov1', label: 'Markov-1', blurb: 'Predicts from your single previous move.' },
  { id: 'ngram', label: 'N-gram (Aaronson)', blurb: 'Matches your last few moves against your history.' },
]

const NGRAM_ORDER = 3

function majority(zeros: number, ones: number): Move | null {
  if (zeros === ones) return null
  return ones > zeros ? 1 : 0
}

function predictFrequency(history: Move[]): Move | null {
  let zeros = 0
  let ones = 0
  for (const m of history) {
    if (m === 0) zeros++
    else ones++
  }
  return majority(zeros, ones)
}

// What move historically followed the most recent `order` moves?
function predictByContext(history: Move[], order: number): Move | null {
  if (history.length < order) return null
  const ctx = history.slice(history.length - order).join('')
  let zeros = 0
  let ones = 0
  for (let i = 0; i + order < history.length; i++) {
    if (history.slice(i, i + order).join('') !== ctx) continue
    if (history[i + order] === 0) zeros++
    else ones++
  }
  return majority(zeros, ones)
}

// Aaronson oracle: longest matching context wins, backing off to shorter ones.
function predictNgram(history: Move[]): Move | null {
  for (let order = NGRAM_ORDER; order >= 1; order--) {
    const guess = predictByContext(history, order)
    if (guess !== null) return guess
  }
  return null
}

// Returns the model's guess, or null when it has no basis yet.
export function predict(model: ModelId, history: Move[]): Move | null {
  switch (model) {
    case 'frequency':
      return predictFrequency(history)
    case 'markov1':
      return predictByContext(history, 1)
    case 'ngram':
      return predictNgram(history)
  }
}

export function randomMove(): Move {
  return Math.random() < 0.5 ? 0 : 1
}
