import { useState } from 'react'
import {
  buildShareText,
  copyShareText,
  downloadCanvas,
  renderShareCard,
} from '../infra/shareCard.ts'

export interface ShareCardProps {
  accuracyPct: number
  rounds: number
  disabled: boolean
}

export function ShareCard({ accuracyPct, rounds, disabled }: ShareCardProps) {
  const [copied, setCopied] = useState(false)

  function onSaveImage() {
    const canvas = renderShareCard({ accuracyPct, rounds })
    downloadCanvas(canvas, 'oracle-result.png')
  }

  async function onCopy() {
    const ok = await copyShareText(buildShareText({ accuracyPct, rounds }))
    setCopied(ok)
    if (ok) setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="share">
      <button onClick={onSaveImage} disabled={disabled}>
        Save result image
      </button>
      <button onClick={onCopy} disabled={disabled}>
        {copied ? 'Copied!' : 'Copy share text'}
      </button>
    </div>
  )
}
