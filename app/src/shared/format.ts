import type { Move } from '../domain/types.ts'

export const sideLabel = (m: Move): string => (m === 0 ? 'LEFT' : 'RIGHT')
export const sideChar = (m: Move): string => (m === 0 ? 'L' : 'R')
