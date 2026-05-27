import type { Round } from '../features/game.ts'
import { sideLabel } from '../shared/format.ts'

export function Feedback({ last }: { last: Round | null }) {
  if (!last) {
    return (
      <p className="feedback idle" aria-live="polite">
        Press <kbd>←</kbd> or <kbd>→</kbd> as randomly as you can.
      </p>
    )
  }
  return (
    <p className={`feedback ${last.hit ? 'caught' : 'fooled'}`} aria-live="polite">
      Oracle guessed <strong>{sideLabel(last.guess)}</strong> —{' '}
      {last.hit ? 'caught you!' : 'you fooled it!'}
    </p>
  )
}
