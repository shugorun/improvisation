import type { Move, TopContext } from '../domain/types.ts'
import { sideChar } from '../shared/format.ts'

export interface InsightProps {
  context: Move[]
  guess: Move
  confidence: number
  hasBasis: boolean
  topContexts: TopContext[]
}

function ContextCells({ moves }: { moves: Move[] }) {
  if (moves.length === 0) return <span className="ctx-empty">∅</span>
  return (
    <>
      {moves.map((m, i) => (
        <span key={i} className="ctx-cell">
          {sideChar(m)}
        </span>
      ))}
    </>
  )
}

export function Insight({ context, guess, confidence, hasBasis, topContexts }: InsightProps) {
  return (
    <details className="insight">
      <summary>What the Oracle sees</summary>
      <div className="insight-body">
        <p className="insight-now">
          {hasBasis ? (
            <>
              After <ContextCells moves={context} /> you tend to go{' '}
              <strong>{sideChar(guess)}</strong> — predicting at {Math.round(confidence * 100)}%.
            </>
          ) : (
            <>No pattern locked yet — the Oracle is flipping a coin until you reveal one.</>
          )}
        </p>
        {topContexts.length > 0 && (
          <ul className="insight-list">
            {topContexts.map((t, i) => (
              <li key={i}>
                <span className="ctx">
                  <ContextCells moves={t.context} />
                </span>
                <span className="arrow">→ {sideChar(t.next)}</span>
                <span className="prob">{Math.round(t.prob * 100)}%</span>
                <span className="count">n={t.count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </details>
  )
}
