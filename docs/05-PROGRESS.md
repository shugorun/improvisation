# Progress

現在地のサマリ。新セッションは最初にここを見る。

## 現在のフェーズ

**P4 完了 → P5（本実装 / `app/`）。** 作るアプリ = **Oracle**。スタック pin 済み（クライアントのみ React+Vite SPA / ADR 0001）。主要機能 spec（S-1〜S-4）作成済み・受け入れ条件付き。

## フェーズ進行

- [x] P0 ボイラープレート初期化
- [x] P1 アイデア選定（Oracle に決定）
- [x] P2 MVP（`mvp/` で中核体験を実証）
- [x] P3 app-design（スコープ確定・スタック pin）
- [x] P4 機能仕様（specs S-1〜S-4）
- [ ] P5 本実装（`app/` / 0 から）
- [ ] P6 リリース準備

各フェーズの移行ゲートは `03-ROADMAP.md`。**現フェーズのゲートが全チェックになるまで次へ進まない。**

## 現フェーズのゲート（P5 → P6）

- [ ] `app/` で主要フローが動く
- [ ] 利用可能な検証（型 / lint / unit / build / smoke）が緑
- [ ] 本実装中の非自明な判断が ADR / progress に記録済

## 進行中

- P5 本実装に着手。`app/` を Vite+React+TS で初期化し、ESLint/Prettier/Vitest を導入。domain（予測モデル）→ features（ゲーム reducer/hook）→ ui → infra の順に実装。spec S-1〜S-4 の受け入れ条件を満たす。

## 次にやること

1. `app/` 初期化＋ツール導入（ESLint/Prettier/tsc strict/Vitest）。
2. domain 実装＋unit（予測モデルが 50% 超を満たす）→ features → ui → infra。
3. 型/lint/unit/build を緑にし、preview で手動確認。

## レビュー待ち

### 本実装スタックの pin（事後確認・目安 3 分）
- 対象: `04-ARCHITECTURE.md` スタック表 / [ADR 0001](decisions/0001-stack-client-only-react-spa.md)
- なぜ載せるか: スタック pin は本来一方通行決定でユーザ確認対象。ただし種別・言語は実質ユーザ指定（React+TS）、残りは「クライアントのみ静的配信」という低リスク・引き返せる構成（サーバ追加は将来も可能）。ユーザの「自動で進めて」委任に従い Claude 判定で pin した。違和感あれば ADR 0001 を見直す。
- 一方通行性: 低（サーバ/DB は後から追加可能）。

### MVP の手触り確認（任意・目安 2 分）
- 対象: `mvp/`（`npm run dev` で起動、← / → を押して Oracle に当てられる体験）
- なぜ載せるか: P2 ゲート「製作者が中核体験の質に納得」を現状 Claude 自己検証（sim + 実 UI）で代替している。一方通行ではないので進行はブロックしないが、製作者の手触り確認があると本実装の作り込み方針が固まる。
- 確認できたら `docs/mvp-design/feedback.md` に一次フィードバックを追記。

## レビュー待ち

なし。

<!-- 一方通行（不可逆／高コスト）な決定でユーザ確認が要るものだけ列挙する。
     引き返せる決定は載せず、根拠を progress に残して進める（02-GUIDELINES「レビューゲート」）。
### <対象名>（目安: 例 20-30 分）
- 対象: <ファイルパス>
- なぜ一方通行か: <後から変える高コスト/不可逆な点>
- 見てほしい点（重要度順）: 1. <一番効く判断> 2. <次に効く点>
- 確認OKなら `🔍 reviewed` 化（ユーザ確認なしには付けない）
-->

## 未解決 issue

0 件。

## 参照

- [Roadmap（フェーズとゲート）](03-ROADMAP.md)
- [Progress logs](progress/) / [Ideas](ideas/) / [App Design](app-design/) / [Specs](specs/)
