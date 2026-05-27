export interface StatsBarProps {
  accuracyPct: number
  rounds: number
  streak: number
  predictability: number | null
  bestFoolStreak: number
}

export function StatsBar({
  accuracyPct,
  rounds,
  streak,
  predictability,
  bestFoolStreak,
}: StatsBarProps) {
  return (
    <div className="stats">
      <div className="stat big">
        <span className="value">{rounds === 0 ? '—' : `${accuracyPct}%`}</span>
        <span className="label">Oracle accuracy · random = 50%</span>
      </div>
      <div className="stat">
        <span className="value">{rounds}</span>
        <span className="label">rounds</span>
      </div>
      <div className="stat">
        <span className="value">{predictability === null ? '…' : `${predictability}%`}</span>
        <span className="label">how predictable you are</span>
      </div>
      <div className="stat">
        <span className="value">{streak}</span>
        <span className="label">catch streak</span>
      </div>
      <div className="stat">
        <span className="value">{bestFoolStreak}</span>
        <span className="label">best evasion</span>
      </div>
    </div>
  )
}
