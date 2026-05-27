import { APP_NAME, APP_TAGLINE } from '../shared/constants.ts'

export interface ShareData {
  accuracyPct: number
  rounds: number
}

export function buildShareText(data: ShareData): string {
  const url = globalThis.location?.href ?? ''
  return `The ${APP_NAME} predicted my "random" choices ${data.accuracyPct}% of the time over ${data.rounds} rounds. Can you be more random? ${url}`.trim()
}

export async function copyShareText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false // clipboard blocked: caller shows the text for manual copy
  }
}

const CARD_W = 1200
const CARD_H = 630
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif'

export function renderShareCard(data: ShareData): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = CARD_W
  canvas.height = CARD_H
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  ctx.fillStyle = '#0c0f1a'
  ctx.fillRect(0, 0, CARD_W, CARD_H)
  ctx.textAlign = 'center'

  ctx.fillStyle = '#9aa4bf'
  ctx.font = `600 40px ${FONT}`
  ctx.fillText(APP_NAME.toUpperCase() + ' — ' + APP_TAGLINE, CARD_W / 2, 130)

  ctx.fillStyle = '#ffd166'
  ctx.font = `800 230px ${FONT}`
  ctx.fillText(`${data.accuracyPct}%`, CARD_W / 2, 400)

  ctx.fillStyle = '#e6e9f0'
  ctx.font = `500 44px ${FONT}`
  ctx.fillText(`predicted my next move · ${data.rounds} rounds`, CARD_W / 2, 480)

  ctx.fillStyle = '#6b7596'
  ctx.font = `400 34px ${FONT}`
  ctx.fillText('random = 50%. Can you beat the Oracle?', CARD_W / 2, 560)

  return canvas
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.click()
    URL.revokeObjectURL(url)
  })
}
