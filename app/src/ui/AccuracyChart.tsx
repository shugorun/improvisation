import type { AccuracyPoint } from '../features/game.ts'

const W = 100
const H = 48

export function AccuracyChart({ series }: { series: AccuracyPoint[] }) {
  const n = series.length
  const xAt = (i: number) => (n <= 1 ? 0 : (i / (n - 1)) * W)
  const yAt = (acc: number) => (1 - acc) * H
  const path = series
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(2)} ${yAt(p.accuracy).toFixed(2)}`)
    .join(' ')

  return (
    <svg
      className="chart"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Oracle accuracy over time, against the 50% baseline"
    >
      <line x1="0" y1={H / 2} x2={W} y2={H / 2} className="chart-baseline" />
      {n === 1 && <circle cx={xAt(0)} cy={yAt(series[0].accuracy)} r="1.4" className="chart-dot" />}
      {n > 1 && <path d={path} className="chart-line" fill="none" />}
    </svg>
  )
}
