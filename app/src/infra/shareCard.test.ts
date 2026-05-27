import { describe, it, expect } from 'vitest'
import { buildShareText } from './shareCard.ts'

describe('buildShareText', () => {
  it('includes the accuracy and round count', () => {
    const text = buildShareText({ accuracyPct: 64, rounds: 150 })
    expect(text).toContain('64%')
    expect(text).toContain('150 rounds')
  })
})
