# Spec: Stats & Insight（統計と予測の可視化）

## status

📝 draft

## 一方通行決定（レビュー対象）

- なし・Claude 判定（表示のみ。外部契約・永続化なし）。

## ユーザレビュー

不要（一方通行決定なし）。

## 1. 概要

「Oracle は 50% を超えて当てている」を可視化し、なぜ当たるかを理解させるセクション。驚きを理解に変える。

## 2. スコープ

### 対象

- ライブ統計: Oracle 的中率（大）、ラウンド数、捕捉ストリーク、予測されやすさスコア。
- 精度チャート: 的中率推移を 50% 基準線と重ねた軽量 SVG。
- 予測の中身（Insight）: 現在文脈（直近 k 手）と次予測＋信頼度、よく当てる文脈の上位（例「L,R,L → R 73%」）。

### 非対象

- スコア算出ロジック（→ prediction-models）。
- 共有カード（→ share-explain）。

## 3. UI / UX

```text
Stats
  [的中率 大]  [rounds]  [catch streak]  [予測されやすさ %]
AccuracyChart（SVG ライン + 50% 基準線）
Insight（折りたたみ）
  現在の文脈: [L R L] → 予測 R（信頼度 73%）
  よく当てる文脈 Top N: L,R,L → R 73% (n=…)
```

- 学習中（rounds < MIN_ROUNDS）はスコア/予測されやすさを「測定中」と表示。
- チャートは自前 SVG（チャートライブラリ不要）。点が増えてもパスを再計算。

## 4. ユースケース

| # | ユーザ操作 | システム動作 | 結果 |
|---|---|---|---|
| 1 | プレイ進行 | rounds ごとに accuracy 点を追加、チャート・数値を更新 | 50% 線を超えて上振れが見える |
| 2 | Insight を開く | 現在文脈の予測・信頼度・top contexts を表示 | 「自分の癖」が見える |
| 3 | rounds 不足 | 「測定中」を表示 | 早すぎる断定を避ける |

## 5. データモデル

```typescript
type AccuracyPoint = { round: number; accuracy: number } // 0..1
type StatsView = {
  accuracyPct: number
  rounds: number
  streak: number
  predictabilityScore: number | null // null = 測定中
  series: AccuracyPoint[]
}
```

- series は長くなりすぎたら間引く（例: 直近 N 点＋ダウンサンプル）。

## 6. 状態遷移

```text
measuring(rounds<MIN) --> live(rounds>=MIN)
```

## 7. API / 外部連携

| Action | 用途 | 認証 |
|---|---|---|
| なし | 表示のみ | — |

## 8. エラー / 例外

- データ点 0/1 のときチャートは空 or 単点を安全に描く（NaN パスを出さない）。

## 9. 実装方針

- コンポーネント: `StatsBar` / `AccuracyChart`（SVG）/ `Insight`（`ui/`）。
- データは features の state から派生（再計算は memo 化）。
- パフォーマンス: series 間引き、SVG パスは memo。

## 10. 検証

- [ ] Unit: predictabilityScore 表示の「測定中」境界／series 間引きロジック／SVG パス生成が点数 0・1・多数で NaN を出さない。
- [ ] Manual: 的中率が 50% 線を超えて推移するのが見える／Insight が現在文脈を正しく示す／モバイル幅で崩れない。

## 11. 受け入れ条件

- [ ] 的中率・rounds・streak・予測されやすさが正しく更新表示される。
- [ ] チャートが的中率推移と 50% 基準線を表示し、点数の境界で崩れない。
- [ ] Insight が現在文脈の予測・信頼度・よく当てる文脈上位を表示する。
- [ ] rounds 不足時は「測定中」を表示する。

## 12. 未確定事項

- [ ] series 間引きの具体パラメータ。
- [ ] Insight の信頼度表現（数値 / バー）。

## 13. 関連

- app-design: [frontend.md](../../app-design/frontend.md), [mechanics.md](../../app-design/mechanics.md)
- spec: prediction-models, core-game
