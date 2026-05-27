# Spec: Prediction Models（予測モデル）

## status

📝 draft

## 一方通行決定（レビュー対象）

- なし・Claude 判定（純粋な内部ロジック。アルゴリズム・パラメータは後から差し替え可能）。

## ユーザレビュー

不要（一方通行決定なし）。

## 1. 概要

History（Move 列）から次手を予測する Oracle の頭脳。純関数で `domain` に置き、振る舞いを Vitest で固定する。

## 2. スコープ

### 対象

- 3 モデル: n-gram backoff（既定）/ Markov-1 / Frequency。
- 予測されやすさスコア（predictabilityScore）の算出。
- モデル / n-gram order の切替。
- 予測の中身（現在文脈の予測＋信頼度、よく当てる文脈上位）の供給（表示は stats-insight）。

### 非対象

- UI 表示・チャート（→ stats-insight）。
- ゲームのループ制御（→ core-game）。

## 3. UI / UX

- 設定セクションでモデルと order を切替（既定: n-gram, order=実測で 4 or 5）。
- 履歴は保持したままモデルを差し替えて比較できる。

## 4. ユースケース

| # | 入力 | 動作 | 結果 |
|---|---|---|---|
| 1 | history, model=ngram | 直近 order 手を文脈に、過去の後続頻度で多い側を予測。無ければ order を減らしバックオフ | Move または null（基盤なし） |
| 2 | history, model=markov1 | order=1 の特殊形 | Move または null |
| 3 | history, model=frequency | 全体の L/R 比で多い側 | Move または null |
| 4 | accuracy, rounds | predictabilityScore を算出 | 0–100（rounds 不足時は「測定中」） |

## 5. データモデル

```typescript
type ModelId = 'ngram' | 'markov1' | 'frequency'

interface Predictor {
  observe(move: Move): void        // 逐次更新（O(1)/手 を志向）
  predict(): { guess: Move | null; confidence: number; context: Move[] }
  topContexts(n: number): { context: Move[]; next: Move; prob: number; count: number }[]
}

// predictabilityScore = clamp(round((accuracy - 0.5) / 0.5 * 100), 0, 100)
//   accuracy = hits / rounds、rounds >= MIN_ROUNDS のときだけ確定表示
```

## 6. 状態遷移

```text
empty --observe*--> learning(基盤不足: predict=null/coin-flip) --observe*--> locked(基盤あり)
```

## 7. API / 外部連携

| Action | 用途 | 認証 |
|---|---|---|
| なし | 純ローカル計算 | — |

## 8. エラー / 例外

- 空 history / 文脈未出現: predict は null を返す（呼び出し側で coin-flip）。握りつぶさず明示的に null。

## 9. 実装方針

- 文脈キー（直近 k 手の文字列）→ [count0, count1] の Map を `observe` で逐次更新。
- backoff: order=N→1 で最初に基盤のある order を採用。
- predictor はモデルごとに生成。order は n-gram のパラメータ。
- 純粋・副作用なし（テスト容易）。

## 10. 検証

- [ ] Unit: synthetic な human-like 系列（過交替・連続回避）で ngram/markov1 が 50% を有意に上回る／frequency は偏り遷移を捉えず ≈50%。
- [ ] Unit: backoff 境界（長文脈未出現→短文脈採用）／空・単一要素 history で null。
- [ ] Unit: predictabilityScore のクランプと MIN_ROUNDS 未満の「測定中」。

## 11. 受け入れ条件

- [ ] ngram（既定 order）が human-like 系列で安定して 50% を有意に上回る（概ね 60%+）。
- [ ] モデル/order を切替えると以降の予測が変わる（履歴は保持）。
- [ ] predict は基盤が無いとき null を返し、ゲームは coin-flip で継続する。
- [ ] predictabilityScore が rounds に応じて「測定中」→数値へ移行する。

## 12. 未確定事項

- [ ] 既定 n-gram order（4 or 5）と MIN_ROUNDS（例 20）は実測で確定。
- [ ] topContexts の信頼度の定義（頻度ベース or Laplace 平滑）。

## 13. 関連

- app-design: [mechanics.md](../../app-design/mechanics.md), [technical.md](../../app-design/technical.md)
- spec: core-game, stats-insight
- mvp 参考: `mvp/src/oracle.ts`（使い捨て。app では 0 から書き逐次更新化する）
