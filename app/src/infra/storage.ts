import { STORAGE_KEY } from '../shared/constants.ts'

export interface Persisted {
  bestFoolStreak: number // the player's longest run of evading the Oracle
}

const DEFAULT: Persisted = { bestFoolStreak: 0 }

// Accessing localStorage can throw (private mode / blocked cookies), so guard it.
function getStore(): Storage | null {
  try {
    return globalThis.localStorage ?? null
  } catch {
    return null
  }
}

function isPersisted(value: unknown): value is Persisted {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).bestFoolStreak === 'number'
  )
}

export function loadPersisted(): Persisted {
  const store = getStore()
  if (!store) return { ...DEFAULT }
  try {
    const raw = store.getItem(STORAGE_KEY)
    if (raw === null) return { ...DEFAULT }
    const parsed: unknown = JSON.parse(raw)
    return isPersisted(parsed) ? parsed : { ...DEFAULT }
  } catch {
    return { ...DEFAULT } // corrupt JSON or unavailable storage: fail soft
  }
}

export function savePersisted(value: Persisted): void {
  const store = getStore()
  if (!store) return
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // storage full or blocked: persistence is non-critical, so ignore.
  }
}
