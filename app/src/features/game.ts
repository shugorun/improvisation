import { createPredictor, type PredictorOptions } from '../domain/predictor.ts'
import type { Move, ModelId, TopContext } from '../domain/types.ts'
import { CHART_MAX_POINTS } from '../shared/constants.ts'

export interface Round {
  guess: Move
  actual: Move
  hit: boolean
}

export interface AccuracyPoint {
  round: number
  accuracy: number
}

export interface GameState {
  history: Move[]
  marks: boolean[] // per-round: did the Oracle catch this move? (parallel to history)
  rounds: number
  hits: number
  streak: number // Oracle's current run of correct predictions
  foolStreak: number // player's current run of evading
  bestFoolStreak: number
  last: Round | null
  // The Oracle's guess for the NEXT move, locked in before that move is seen.
  committedGuess: Move
  committedHasBasis: boolean
  committedConfidence: number
  committedContext: Move[]
  series: AccuracyPoint[]
  topContexts: TopContext[]
}

export interface Game {
  readonly model: ModelId
  getState(): GameState
  play(move: Move): GameState
  reset(): GameState
}

type Rng = () => number

const TOP_CONTEXTS = 6

// Keep the chart bounded without distorting its shape: halve resolution when it overflows.
function downsample(points: AccuracyPoint[], max: number): AccuracyPoint[] {
  if (points.length <= max) return points
  const out: AccuracyPoint[] = []
  for (let i = 0; i < points.length; i += 2) out.push(points[i])
  const last = points[points.length - 1]
  if (out[out.length - 1] !== last) out.push(last)
  return out
}

export function createGame(
  model: ModelId,
  options: PredictorOptions = {},
  rng: Rng = Math.random,
): Game {
  let predictor = createPredictor(model, options)
  const coin = (): Move => (rng() < 0.5 ? 0 : 1)

  function buildInitial(): GameState {
    const p = predictor.predict()
    return {
      history: [],
      marks: [],
      rounds: 0,
      hits: 0,
      streak: 0,
      foolStreak: 0,
      bestFoolStreak: 0,
      last: null,
      committedGuess: p.guess ?? coin(),
      committedHasBasis: p.guess !== null,
      committedConfidence: p.confidence,
      committedContext: p.context,
      series: [],
      topContexts: [],
    }
  }

  let state = buildInitial()

  function play(move: Move): GameState {
    const guess = state.committedGuess // locked BEFORE we observe this move (no leak)
    const hit = guess === move
    predictor.observe(move)
    const next = predictor.predict()
    const rounds = state.rounds + 1
    const hits = state.hits + (hit ? 1 : 0)
    const foolStreak = hit ? 0 : state.foolStreak + 1
    state = {
      history: [...state.history, move],
      marks: [...state.marks, hit],
      rounds,
      hits,
      streak: hit ? state.streak + 1 : 0,
      foolStreak,
      bestFoolStreak: Math.max(state.bestFoolStreak, foolStreak),
      last: { guess, actual: move, hit },
      committedGuess: next.guess ?? coin(),
      committedHasBasis: next.guess !== null,
      committedConfidence: next.confidence,
      committedContext: next.context,
      series: downsample(
        [...state.series, { round: rounds, accuracy: hits / rounds }],
        CHART_MAX_POINTS,
      ),
      topContexts: predictor.topContexts(TOP_CONTEXTS),
    }
    return state
  }

  function reset(): GameState {
    predictor = createPredictor(model, options)
    state = buildInitial()
    return state
  }

  return { model, getState: () => state, play, reset }
}
