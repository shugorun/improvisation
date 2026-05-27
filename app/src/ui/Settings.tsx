import type { ModelId } from '../domain/types.ts'

const MODELS: { id: ModelId; label: string; blurb: string }[] = [
  {
    id: 'ngram',
    label: 'N-gram',
    blurb: 'Matches your last few moves against your history (Aaronson oracle).',
  },
  { id: 'markov1', label: 'Markov-1', blurb: 'Predicts from your single previous move.' },
  {
    id: 'frequency',
    label: 'Frequency',
    blurb: 'Just your overall left/right ratio — and it barely beats chance.',
  },
]

const ORDERS = [2, 3, 4, 5, 6]

export interface SettingsProps {
  model: ModelId
  order: number
  onModel: (m: ModelId) => void
  onOrder: (o: number) => void
  onReset: () => void
}

export function Settings({ model, order, onModel, onOrder, onReset }: SettingsProps) {
  const active = MODELS.find((m) => m.id === model)
  return (
    <details className="settings">
      <summary>Oracle settings</summary>
      <div className="settings-body">
        <p className="settings-note">
          Switching the model restarts the session for a fair comparison.
        </p>
        <div className="model-buttons">
          {MODELS.map((m) => (
            <button
              key={m.id}
              className={m.id === model ? 'active' : ''}
              onClick={() => onModel(m.id)}
              aria-pressed={m.id === model}
            >
              {m.label}
            </button>
          ))}
        </div>
        <p className="model-blurb">{active?.blurb}</p>
        {model === 'ngram' && (
          <label className="order-row">
            Context length
            <select value={order} onChange={(e) => onOrder(Number(e.target.value))}>
              {ORDERS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        )}
        <button className="reset" onClick={onReset}>
          Reset session
        </button>
      </div>
    </details>
  )
}
