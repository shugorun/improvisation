import { DEFAULT_NGRAM_ORDER, INSIGHT_ORDER } from '../shared/constants.ts'
import type { Move, ModelId, Predictor, Prediction, TopContext } from './types.ts'

type Counts = [zeros: number, ones: number]

export interface PredictorOptions {
  order?: number
}

// Aaronson-style oracle. Counts, for each recent-move context, what the user did next,
// updated incrementally (O(maxOrder) per move). Prediction backs off from the longest
// context to the shortest; frequency is the special case of a global (order 0) count.
export function createPredictor(model: ModelId, options: PredictorOptions = {}): Predictor {
  const isFrequency = model === 'frequency'
  const maxOrder = isFrequency
    ? 0
    : model === 'markov1'
      ? 1
      : Math.max(1, options.order ?? DEFAULT_NGRAM_ORDER)
  const history: Move[] = []
  const counts = new Map<string, Counts>() // key: context moves joined ('' = global)

  function bump(key: string, next: Move): void {
    let c = counts.get(key)
    if (!c) {
      c = [0, 0]
      counts.set(key, c)
    }
    c[next]++
  }

  function observe(move: Move): void {
    if (isFrequency) {
      bump('', move)
    } else {
      for (let order = 1; order <= maxOrder; order++) {
        if (history.length < order) break
        bump(history.slice(history.length - order).join(''), move)
      }
    }
    history.push(move)
  }

  function fromCounts(c: Counts | undefined): { guess: Move | null; confidence: number } {
    if (!c) return { guess: null, confidence: 0.5 }
    const total = c[0] + c[1]
    if (total === 0 || c[0] === c[1]) return { guess: null, confidence: 0.5 }
    const guess: Move = c[1] > c[0] ? 1 : 0
    return { guess, confidence: Math.max(c[0], c[1]) / total }
  }

  function predict(): Prediction {
    if (isFrequency) {
      return { ...fromCounts(counts.get('')), context: [] }
    }
    for (let order = maxOrder; order >= 1; order--) {
      if (history.length < order) continue
      const context = history.slice(history.length - order)
      const result = fromCounts(counts.get(context.join('')))
      if (result.guess !== null) return { ...result, context }
    }
    return { guess: null, confidence: 0.5, context: [] }
  }

  function topContexts(limit: number): TopContext[] {
    if (isFrequency) return []
    const order = Math.min(maxOrder, INSIGHT_ORDER)
    const items: TopContext[] = []
    for (const [key, c] of counts) {
      if (key.length !== order) continue
      const total = c[0] + c[1]
      if (total < 2 || c[0] === c[1]) continue
      const next: Move = c[1] > c[0] ? 1 : 0
      items.push({
        context: key.split('').map((d) => (d === '1' ? 1 : 0)),
        next,
        prob: Math.max(c[0], c[1]) / total,
        count: total,
      })
    }
    items.sort((a, b) => b.prob * b.count - a.prob * a.count)
    return items.slice(0, limit)
  }

  return { model, observe, predict, topContexts }
}
