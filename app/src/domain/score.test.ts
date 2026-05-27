import { describe, it, expect } from 'vitest'
import { accuracy, predictabilityScore } from './score.ts'
import { MIN_ROUNDS_FOR_SCORE } from '../shared/constants.ts'

describe('accuracy', () => {
  it('is 0 with no rounds', () => {
    expect(accuracy(0, 0)).toBe(0)
  })
  it('is hits / rounds', () => {
    expect(accuracy(64, 100)).toBeCloseTo(0.64)
  })
})

describe('predictabilityScore', () => {
  it('is null until there are enough rounds to mean anything', () => {
    expect(predictabilityScore(10, MIN_ROUNDS_FOR_SCORE - 1)).toBeNull()
  })
  it('is 0 at chance (50%)', () => {
    expect(predictabilityScore(50, 100)).toBe(0)
  })
  it('is 100 when the Oracle never misses', () => {
    expect(predictabilityScore(100, 100)).toBe(100)
  })
  it('scales between chance and perfect', () => {
    expect(predictabilityScore(64, 100)).toBe(28)
  })
  it('clamps below chance to 0', () => {
    expect(predictabilityScore(40, 100)).toBe(0)
  })
})
