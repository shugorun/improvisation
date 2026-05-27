// Sanity check: does the Oracle beat 50% on "human-like" input?
// Humans over-alternate and avoid long runs, so their "random" presses are predictable.
// Run with Node 24 (native TS): `node sim.ts`

import { type ModelId, type Move, predict, randomMove } from './src/oracle.ts'

function humanLikeSequence(n: number): Move[] {
  const seq: Move[] = []
  for (let i = 0; i < n; i++) {
    if (i === 0) {
      seq.push(randomMove())
      continue
    }
    const lastTwoSame = i >= 2 && seq[i - 1] === seq[i - 2]
    const pSwitch = lastTwoSame ? 0.8 : 0.65 // bias against repeats / runs
    const prev = seq[i - 1]
    const switched = Math.random() < pSwitch
    seq.push((switched ? 1 - prev : prev) as Move)
  }
  return seq
}

function accuracyOf(model: ModelId, seq: Move[]): number {
  let hits = 0
  const history: Move[] = []
  for (const actual of seq) {
    const guess = predict(model, history) ?? randomMove()
    if (guess === actual) hits++
    history.push(actual)
  }
  return hits / seq.length
}

const N = 3000
const seq = humanLikeSequence(N)
const models: ModelId[] = ['frequency', 'markov1', 'ngram']
console.log(`Human-like sequence, n=${N} (random baseline = 50%)`)
for (const m of models) {
  console.log(`  ${m.padEnd(10)} ${(accuracyOf(m, seq) * 100).toFixed(1)}%`)
}
