import { useCallback, useRef, useState } from 'react'
import { createGame, type Game, type GameState } from './game.ts'
import type { Move, ModelId } from '../domain/types.ts'

// Switching model/order starts a fresh session: accuracy across different models
// isn't comparable, so a clean restart keeps the headline number honest.
export function useOracleGame(model: ModelId, order: number) {
  const key = `${model}:${order}`
  const ref = useRef<{ key: string; game: Game } | null>(null)
  if (!ref.current || ref.current.key !== key) {
    ref.current = { key, game: createGame(model, { order }) }
  }
  const game = ref.current.game

  const [state, setState] = useState<GameState>(game.getState)

  // Publish the new game's state when the model/order changes (state-from-props pattern).
  const lastKey = useRef(key)
  if (lastKey.current !== key) {
    lastKey.current = key
    setState(game.getState())
  }

  const play = useCallback((move: Move) => setState(game.play(move)), [game])
  const reset = useCallback(() => setState(game.reset()), [game])

  return { state, play, reset }
}
