import { describe, it, expect, beforeEach } from 'vitest'
import { loadPersisted, savePersisted } from './storage.ts'
import { STORAGE_KEY } from '../shared/constants.ts'

class FakeStorage {
  private map = new Map<string, string>()
  getItem(k: string) {
    return this.map.has(k) ? this.map.get(k)! : null
  }
  setItem(k: string, v: string) {
    this.map.set(k, v)
  }
  removeItem(k: string) {
    this.map.delete(k)
  }
  clear() {
    this.map.clear()
  }
  set(k: string, v: string) {
    this.map.set(k, v)
  }
}

let fake: FakeStorage

beforeEach(() => {
  fake = new FakeStorage()
  Object.defineProperty(globalThis, 'localStorage', { value: fake, configurable: true })
})

describe('storage', () => {
  it('returns the default when nothing is stored', () => {
    expect(loadPersisted()).toEqual({ bestFoolStreak: 0 })
  })

  it('round-trips a saved value', () => {
    savePersisted({ bestFoolStreak: 7 })
    expect(loadPersisted()).toEqual({ bestFoolStreak: 7 })
  })

  it('falls back to default on corrupt JSON (no throw)', () => {
    fake.set(STORAGE_KEY, '{not valid json')
    expect(loadPersisted()).toEqual({ bestFoolStreak: 0 })
  })

  it('falls back to default on a value of the wrong shape', () => {
    fake.set(STORAGE_KEY, JSON.stringify({ nope: true }))
    expect(loadPersisted()).toEqual({ bestFoolStreak: 0 })
  })
})
