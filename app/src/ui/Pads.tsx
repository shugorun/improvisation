import type { Move } from '../domain/types.ts'

export function Pads({ onPlay }: { onPlay: (move: Move) => void }) {
  return (
    <div className="pads" role="group" aria-label="Play a move">
      <button className="pad" onClick={() => onPlay(0)} aria-label="Left">
        <span className="pad-key">←</span>
        <span className="pad-label">LEFT</span>
      </button>
      <button className="pad" onClick={() => onPlay(1)} aria-label="Right">
        <span className="pad-key">→</span>
        <span className="pad-label">RIGHT</span>
      </button>
    </div>
  )
}
