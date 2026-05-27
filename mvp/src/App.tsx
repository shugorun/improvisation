import { useCallback, useEffect, useMemo, useState } from 'react'
import { MODELS, type ModelId, type Move, predict, randomMove } from './oracle.ts'

interface RoundResult {
  guess: Move
  actual: Move
  hit: boolean
}

const side = (m: Move) => (m === 0 ? 'LEFT' : 'RIGHT')

export default function App() {
  const [history, setHistory] = useState<Move[]>([])
  const [model, setModel] = useState<ModelId>('ngram')
  const [rounds, setRounds] = useState(0)
  const [hits, setHits] = useState(0)
  const [streak, setStreak] = useState(0)
  const [last, setLast] = useState<RoundResult | null>(null)
  const [caughtFlags, setCaughtFlags] = useState<boolean[]>([])

  // Locked once per round: the Oracle commits before it sees your move.
  const oracle = useMemo(() => {
    const p = predict(model, history)
    return { guess: p ?? randomMove(), hasBasis: p !== null }
  }, [history, model])

  const play = useCallback(
    (move: Move) => {
      const guess = oracle.guess
      const hit = guess === move
      setHits((h) => h + (hit ? 1 : 0))
      setRounds((r) => r + 1)
      setStreak((s) => (hit ? s + 1 : 0))
      setLast({ guess, actual: move, hit })
      setCaughtFlags((f) => [...f, hit])
      setHistory((h) => [...h, move])
    },
    [oracle],
  )

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') play(0)
      else if (e.key === 'ArrowRight') play(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [play])

  function reset() {
    setHistory([])
    setRounds(0)
    setHits(0)
    setStreak(0)
    setLast(null)
    setCaughtFlags([])
  }

  const accuracy = rounds === 0 ? 0 : Math.round((hits / rounds) * 100)

  return (
    <main className="app">
      <h1>Oracle</h1>
      <p className="tagline">
        Try to be unpredictable. Press <kbd>←</kbd> / <kbd>→</kbd> (or tap) as randomly as you can.
        I'll guess your next move before you make it.
      </p>

      <Feedback last={last} />

      <div className="pads">
        <button className="pad" onClick={() => play(0)}>
          ← LEFT
        </button>
        <button className="pad" onClick={() => play(1)}>
          RIGHT →
        </button>
      </div>

      <StatsBar accuracy={accuracy} rounds={rounds} streak={streak} />

      <MovesStrip history={history} caughtFlags={caughtFlags} />

      <ModelPicker model={model} onPick={setModel} />

      <button className="reset" onClick={reset}>
        Reset
      </button>
    </main>
  )
}

function Feedback({ last }: { last: RoundResult | null }) {
  if (!last) return <p className="feedback idle">Make your first move…</p>
  return (
    <p className={`feedback ${last.hit ? 'caught' : 'fooled'}`}>
      Oracle guessed <strong>{side(last.guess)}</strong> — {last.hit ? 'caught you!' : 'you fooled it!'}
    </p>
  )
}

function StatsBar({ accuracy, rounds, streak }: { accuracy: number; rounds: number; streak: number }) {
  return (
    <div className="stats">
      <div className="stat big">
        <span className="value">{accuracy}%</span>
        <span className="label">Oracle accuracy (random = 50%)</span>
      </div>
      <div className="stat">
        <span className="value">{rounds}</span>
        <span className="label">rounds</span>
      </div>
      <div className="stat">
        <span className="value">{streak}</span>
        <span className="label">catch streak</span>
      </div>
    </div>
  )
}

function MovesStrip({ history, caughtFlags }: { history: Move[]; caughtFlags: boolean[] }) {
  const start = Math.max(0, history.length - 24)
  const recent = history.slice(start)
  return (
    <div className="strip">
      {recent.map((m, i) => {
        const caught = caughtFlags[start + i]
        return (
          <span key={start + i} className={`cell ${caught ? 'caught' : 'fooled'}`}>
            {m === 0 ? 'L' : 'R'}
          </span>
        )
      })}
    </div>
  )
}

function ModelPicker({ model, onPick }: { model: ModelId; onPick: (m: ModelId) => void }) {
  const active = MODELS.find((m) => m.id === model)
  return (
    <div className="models">
      <div className="model-buttons">
        {MODELS.map((m) => (
          <button
            key={m.id}
            className={m.id === model ? 'active' : ''}
            onClick={() => onPick(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>
      <p className="model-blurb">{active?.blurb}</p>
    </div>
  )
}
