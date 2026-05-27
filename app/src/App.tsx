import { useEffect, useState } from 'react'
import type { ModelId } from './domain/types.ts'
import { predictabilityScore } from './domain/score.ts'
import { useOracleGame } from './features/useOracleGame.ts'
import { loadPersisted, savePersisted } from './infra/storage.ts'
import { APP_NAME, APP_TAGLINE, DEFAULT_NGRAM_ORDER } from './shared/constants.ts'
import { Pads } from './ui/Pads.tsx'
import { Feedback } from './ui/Feedback.tsx'
import { MovesStrip } from './ui/MovesStrip.tsx'
import { StatsBar } from './ui/StatsBar.tsx'
import { AccuracyChart } from './ui/AccuracyChart.tsx'
import { Insight } from './ui/Insight.tsx'
import { ShareCard } from './ui/ShareCard.tsx'
import { Explainer } from './ui/Explainer.tsx'
import { Settings } from './ui/Settings.tsx'

export default function App() {
  const [model, setModel] = useState<ModelId>('ngram')
  const [order, setOrder] = useState(DEFAULT_NGRAM_ORDER)
  const { state, play, reset } = useOracleGame(model, order)
  const [best, setBest] = useState(() => loadPersisted().bestFoolStreak)

  // Persist the player's best evasion streak.
  useEffect(() => {
    if (state.bestFoolStreak > best) {
      setBest(state.bestFoolStreak)
      savePersisted({ bestFoolStreak: state.bestFoolStreak })
    }
  }, [state.bestFoolStreak, best])

  // Keyboard play (preventDefault stops the arrows from scrolling the page).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        play(0)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        play(1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [play])

  const accuracyPct = state.rounds === 0 ? 0 : Math.round((state.hits / state.rounds) * 100)
  const predictability = predictabilityScore(state.hits, state.rounds)
  const bestShown = Math.max(best, state.bestFoolStreak)

  return (
    <main className="app">
      <header className="hero">
        <h1>{APP_NAME}</h1>
        <p className="tagline">
          {APP_TAGLINE} Press <kbd>←</kbd> / <kbd>→</kbd> (or tap) as randomly as you can —
          I&apos;ll guess your next move before you make it.
        </p>
      </header>

      <Feedback last={state.last} />
      <Pads onPlay={play} />
      <MovesStrip history={state.history} marks={state.marks} />

      <StatsBar
        accuracyPct={accuracyPct}
        rounds={state.rounds}
        streak={state.streak}
        predictability={predictability}
        bestFoolStreak={bestShown}
      />
      <AccuracyChart series={state.series} />

      <Insight
        context={state.committedContext}
        guess={state.committedGuess}
        confidence={state.committedConfidence}
        hasBasis={state.committedHasBasis}
        topContexts={state.topContexts}
      />

      <ShareCard accuracyPct={accuracyPct} rounds={state.rounds} disabled={state.rounds === 0} />

      <Explainer />
      <Settings model={model} order={order} onModel={setModel} onOrder={setOrder} onReset={reset} />

      <footer className="foot">
        Everything runs in your browser. Nothing you press is sent anywhere.
      </footer>
    </main>
  )
}
