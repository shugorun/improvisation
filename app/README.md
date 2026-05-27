# Oracle

Try to be unpredictable. Press `←` / `→` (or tap) as randomly as you can — the Oracle predicts your
next move *before* you make it, and usually catches you ~60–70% of the time. A live demonstration of
the Aaronson oracle: people can't be random, and a handful of counters is enough to prove it.

P5 本実装（`docs/03-ROADMAP.md`）。完全クライアントサイド SPA。サーバ・DB・認証なし、入力は外部送信しない。

## 開発

```bash
npm install
npm run dev        # Vite dev server
npm run build      # 型チェック + 本番ビルド (dist/)
npm run preview    # ビルド成果物をプレビュー
```

## 検証（commit 前に全通過＝緑）

```bash
npm run typecheck  # tsc --noEmit (strict)
npm run lint       # ESLint 9 (flat config)
npm run format     # Prettier check (format:write で修正)
npm test           # Vitest (domain / features / infra の振る舞いテスト)
```

## 構成（レイヤ: ui → features → domain、infra は副作用隔離）

```text
src/
  domain/    予測モデル(ngram backoff / markov1 / frequency)・スコア・型。純粋・テスト済み
  features/  ゲームコア(createGame)＋React hook(useOracleGame)。予測リーク防止
  ui/        コンポーネント(Pads/Feedback/MovesStrip/StatsBar/AccuracyChart/Insight/ShareCard/Explainer/Settings)
  infra/     localStorage 永続化・共有カード(Canvas PNG)
  shared/    定数・整形ヘルパ
```

スタックは `docs/04-ARCHITECTURE.md`（pin 済み / ADR 0001）、仕様は `docs/specs/`。
