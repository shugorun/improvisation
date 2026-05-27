import { describe, it, expect } from 'vitest'
import { createGame } from './game.ts'
import type { Move } from '../domain/types.ts'

// Fixed rng so the coin-flip fallback is deterministic.
const fixedRng = () => 0.123

describe('game core', () => {
  it('does NOT leak: the scored guess is the one committed before the move was seen', () => {
    const game = createGame('ngram', {}, fixedRng)
    const committedBefore = game.getState().committedGuess
    const move: Move = committedBefore === 0 ? 1 : 0 // deliberately play the opposite
    const state = game.play(move)
    expect(state.last?.guess).toBe(committedBefore)
    expect(state.last?.hit).toBe(false) // we played the opposite, so it must be a miss
  })

  it('scores a hit when the player matches the committed guess', () => {
    const game = createGame('ngram', {}, fixedRng)
    const committed = game.getState().committedGuess
    const state = game.play(committed)
    expect(state.last?.hit).toBe(true)
    expect(state.hits).toBe(1)
    expect(state.rounds).toBe(1)
  })

  it('tracks rounds, history and resets streak on a miss', () => {
    const game = createGame('markov1', {}, fixedRng)
    let s = game.getState()
    // Force a known sequence and verify streak bookkeeping.
    const moves: Move[] = [0, 1, 0, 1, 0]
    for (const m of moves) s = game.play(m)
    expect(s.rounds).toBe(5)
    expect(s.history).toEqual(moves)
    expect(s.streak).toBeGreaterThanOrEqual(0)
  })

  it('locks onto a perfectly predictable player', () => {
    const game = createGame('markov1', {}, fixedRng)
    let s = game.getState()
    // Player always alternates: a trivially predictable pattern.
    for (let i = 0; i < 40; i++) s = game.play((i % 2) as Move)
    expect(s.committedHasBasis).toBe(true)
    expect(s.hits / s.rounds).toBeGreaterThan(0.8)
  })

  it('reset clears the session', () => {
    const game = createGame('ngram', {}, fixedRng)
    game.play(0)
    game.play(1)
    const s = game.reset()
    expect(s.rounds).toBe(0)
    expect(s.hits).toBe(0)
    expect(s.history).toEqual([])
    expect(s.last).toBeNull()
  })

  it('builds a bounded accuracy series', () => {
    const game = createGame('ngram', {}, fixedRng)
    let s = game.getState()
    for (let i = 0; i < 300; i++) s = game.play((i % 2) as Move)
    expect(s.series.length).toBeGreaterThan(0)
    expect(s.series.length).toBeLessThanOrEqual(120)
    expect(s.series[s.series.length - 1].round).toBe(300)
  })
})
