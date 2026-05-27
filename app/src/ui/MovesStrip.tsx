import type { Move } from '../domain/types.ts'
import { sideChar } from '../shared/format.ts'
import { STRIP_LENGTH } from '../shared/constants.ts'

export function MovesStrip({ history, marks }: { history: Move[]; marks: boolean[] }) {
  const start = Math.max(0, history.length - STRIP_LENGTH)
  const recent = history.slice(start)
  return (
    <div className="strip" aria-hidden="true">
      {recent.map((move, i) => {
        const caught = marks[start + i]
        return (
          <span key={start + i} className={`cell ${caught ? 'caught' : 'fooled'}`}>
            {sideChar(move)}
          </span>
        )
      })}
    </div>
  )
}
