# Spec: Core Game（コアゲーム）

## status

📝 draft

## 一方通行決定（レビュー対象）

- なし・Claude 判定（外部契約なし。localStorage はベストスコア程度の小さな値で fail-soft、移行コストはほぼゼロ）。

## ユーザレビュー

不要（一方通行決定なし）。

## 1. 概要

← / → を「ランダムに」押すと、Oracle が押下前に次手を予測して当否を返す中核ループ。本アプリの心臓部。

## 2. スコープ

### 対象

- ← / → キーボード入力とタップ/クリック（左右2面）。
- Oracle の予測確定 → 当否判定 → フィードバック → 履歴・統計更新 → 次予測の確定。
- 直近手の strip 表示（赤=捕捉/緑=回避）。
- リセット（セッション初期化。ベストスコアは残す）。

### 非対象

- 予測アルゴリズムの中身（→ prediction-models spec）。
- 統計可視化・チャート（→ stats-insight spec）。
- 共有・説明（→ share-explain spec）。

## 3. UI / UX

```text
Hero
  Title + 一言（操作説明は最小1行）
  Feedback line（aria-live）: 「Oracle は LEFT を予測 — 捕捉！/ 出し抜いた！」/ 初期は「学習中…」
  Pads: [← LEFT] [RIGHT →]（大きい・タップ可）
  Strip: 直近24手（記号 L/R ＋ 色で捕捉/回避）
  Reset
```

- 空状態: 未プレイ時「ランダムに押してみて。次の一手を当てる」。
- 入力は ← / → / タップのみ受理。他キーは無視。
- `prefers-reduced-motion` で演出を抑制。

## 4. ユースケース

| # | ユーザ操作 | システム動作 | 結果 |
|---|---|---|---|
| 1 | ← または → を押す/タップ | 直前に確定済みの guess と比較 → hit 判定 → 統計更新 → move を履歴に追加 → 次 guess を確定 | フィードバック・strip・統計が更新 |
| 2 | 最初の数手（基盤不足） | guess を coin-flip にフォールバック、「学習中」表示 | プレイ継続。精度はまだ参考値 |
| 3 | リセット | 履歴・統計・予測器を初期化（ベストは保持） | 初期状態 |
| 4 | 無関係なキー | 無視 | 変化なし |

## 5. データモデル

```typescript
type Move = 0 | 1 // 0=Left, 1=Right

type Round = { guess: Move; actual: Move; hit: boolean }

type GameState = {
  history: Move[]
  rounds: number
  hits: number
  streak: number          // 連続捕捉数（Oracle 視点）
  last: Round | null
  committedGuess: Move     // 次ラウンドで使う、確定済みの予測
  hasBasis: boolean        // committedGuess が学習に基づくか（false=coin-flip）
}
```

## 6. 状態遷移

```text
idle(empty) --play--> playing(committedGuess を都度再確定)
playing --reset--> idle
```

- 不変条件: `committedGuess` は次の move を観測する**前に**決まっている（情報リーク禁止）。

## 7. API / 外部連携

| Action | 用途 | 認証 |
|---|---|---|
| なし | 完全クライアント。外部送信なし | — |

## 8. エラー / 例外

- localStorage 不可: 永続化のみ無効化し、ゲームは継続（fail soft）。
- 高速連打: 1 イベント = 1 ラウンドで確定的に処理（取りこぼし・二重処理なし）。

## 9. 実装方針

- コンポーネント: `Hero` / `Pads` / `Feedback` / `MovesStrip` / `ResetButton`（`ui/`）。
- 状態管理: `features/useOracleGame`（`useReducer`）。reducer は純粋。予測器は `domain` を呼ぶ。
- 永続化: ベストスコア・累計は `infra/storage`（副作用隔離）。
- パフォーマンス: 予測器は文脈→カウントの Map を逐次更新（O(1)/手）。

## 10. 検証

- [ ] Unit: reducer の play で committedGuess が move 観測前に確定している（リーク無し）／hit 判定・streak・履歴更新が正しい／reset が統計を初期化しベストを残す。
- [ ] Manual: キーボードとタップ両方で動く／連打で崩れない／reduced-motion。

## 11. 受け入れ条件

- [ ] Golden path: ← / → を押すと Oracle 予測の当否・統計・strip が即時更新される。
- [ ] 最初の数手は「学習中」と示し、以降は予測に基づく。
- [ ] リセットで初期化され、ベストスコアは保持される。
- [ ] 無関係なキーで誤動作しない。画面崩れがない（PC / モバイル幅）。
- [ ] キーボードのみで完結し、フィードバックが読み上げられる。

## 12. 未確定事項

- [ ] 「学習中」を抜ける閾値ラウンド数（実装時に調整）。

## 13. 関連

- app-design: [mechanics.md](../../app-design/mechanics.md), [frontend.md](../../app-design/frontend.md)
- spec: prediction-models, stats-insight
- ADR: 0001
