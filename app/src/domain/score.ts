import { MIN_ROUNDS_FOR_SCORE } from '../shared/constants.ts'

export function accuracy(hits: number, rounds: number): number {
  return rounds === 0 ? 0 : hits / rounds
}

// 0 at chance (50%), 100 if the Oracle never misses. null until enough rounds to mean anything.
export function predictabilityScore(hits: number, rounds: number): number | null {
  if (rounds < MIN_ROUNDS_FOR_SCORE) return null
  const score = Math.round(((accuracy(hits, rounds) - 0.5) / 0.5) * 100)
  return Math.max(0, Math.min(100, score))
}
