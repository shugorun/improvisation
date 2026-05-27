import { describe, it, expect } from 'vitest'
import { createPredictor } from './predictor.ts'
import type { Move, ModelId } from './types.ts'

// Deterministic RNG so the statistical assertions never flake.
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Humans over-alternate and avoid long runs: their "random" presses are predictable.
function humanLikeSequence(n: number, seed: number): Move[] {
  const rng = mulberry32(seed)
  const seq: Move[] = []
  for (let i = 0; i < n; i++) {
    if (i < 2) {
      seq.push(rng() < 0.5 ? 0 : 1)
      continue
    }
    const runOfTwo = seq[i - 1] === seq[i - 2]
    const pSwitch = runOfTwo ? 0.8 : 0.65
    const prev = seq[i - 1]
    seq.push(rng() < pSwitch ? ((1 - prev) as Move) : prev)
  }
  return seq
}

// Accuracy over only the rounds where the model committed (had a basis).
function decisiveAccuracy(model: ModelId, seq: Move[], order?: number) {
  const p = createPredictor(model, order ? { order } : {})
  let hits = 0
  let decisions = 0
  for (const actual of seq) {
    const { guess } = p.predict()
    if (guess !== null) {
      decisions++
      if (guess === actual) hits++
    }
    p.observe(actual)
  }
  return { acc: decisions === 0 ? 0 : hits / decisions, coverage: decisions / seq.length }
}

describe('predictor on human-like input', () => {
  const seq = humanLikeSequence(3000, 12345)

  it('n-gram beats chance by a wide margin and commits on most rounds', () => {
    const { acc, coverage } = decisiveAccuracy('ngram', seq)
    expect(acc).toBeGreaterThan(0.6)
    expect(coverage).toBeGreaterThan(0.9)
  })

  it('markov-1 beats chance', () => {
    const { acc } = decisiveAccuracy('markov1', seq)
    expect(acc).toBeGreaterThan(0.6)
  })

  it('frequency stays near chance (the bias lives in transitions, not totals)', () => {
    const { acc } = decisiveAccuracy('frequency', seq)
    expect(acc).toBeGreaterThan(0.4)
    expect(acc).toBeLessThan(0.6)
  })
})

describe('predictor mechanics', () => {
  it('returns null (no basis) on an empty history', () => {
    const p = createPredictor('ngram')
    expect(p.predict().guess).toBeNull()
  })

  it('does not leak: predict() only reflects observed moves', () => {
    const p = createPredictor('markov1')
    p.observe(0)
    p.observe(1)
    p.observe(0)
    p.observe(1) // after 0 -> always 1 so far
    // last move is 1; context "1" has only been followed by 0 once
    expect(p.predict().context).toEqual([1])
  })

  it('backs off to a shorter context when the long one is unseen', () => {
    const p = createPredictor('ngram', { order: 3 })
    // Train a strong order-1 signal: 0 is always followed by 1.
    for (let i = 0; i < 10; i++) {
      p.observe(0)
      p.observe(1)
    }
    // Current tail "...1,0" — a length-3 context that may be sparse, but order-1 ("0") is decisive.
    const { guess } = p.predict()
    expect(guess).not.toBeNull()
  })

  it('surfaces predictive contexts via topContexts', () => {
    const seq = humanLikeSequence(500, 7)
    const p = createPredictor('ngram')
    for (const m of seq) p.observe(m)
    const top = p.topContexts(5)
    expect(top.length).toBeGreaterThan(0)
    expect(top[0].prob).toBeGreaterThan(0.5)
    expect(top[0].count).toBeGreaterThanOrEqual(2)
  })
})
