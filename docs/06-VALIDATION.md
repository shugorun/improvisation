# Validation

検証方針。技術スタックとプロダクトが決まったら具体化する。

## 検証レイヤ

| レイヤ | 目的 | 例 |
|---|---|---|
| Static | 型、lint、フォーマット | TypeScript, ESLint, Ruff, etc. |
| Unit | 純粋ロジック | domain / utils |
| Integration | API、DB、状態連携 | repository / service |
| E2E | 主要ユーザフロー | Playwright, Maestro, Cypress |
| Manual | UX、見た目、例外導線 | 実機 / ブラウザ確認 |

## テストの置き場所と再利用

- テストはコードと同居する（`docs/` 配下ではない）。本実装は `app/`、MVP は `mvp/`。
- 具体レイアウト（コロケーション / `tests/` / `*_test.go` 等）は**言語・スタックの慣習に従う**。スタック確定（P3）時に決め、`04-ARCHITECTURE.md` ディレクトリ方針に記す。
- **本実装(P5)のテストは残して再利用する**（回帰スイート）。commit / checkpoint のたびに回し、全通過が「緑」の一部。
- **MVP(P2)のテストは使い捨て**。普通ほぼ書かない（MVP は学習目的）。書いても `app/` には引き継がない。評価スクリプト（例: RAG の recall 測定）は `mvp/` に置き、結果は `docs/mvp-design/experiments.md` に記録する。

## 受け入れ条件テンプレ

各 spec（P4）に以下を持たせる。P5 本実装の検証はこれを満たすことを確認する。

- Golden path が通る。
- 主要なエラー分岐が期待通り表示される。
- 入力バリデーションが効く。
- データ保存 / 更新 / 削除が期待通り。
- 画面崩れがない。
- リリース対象環境で確認済み。

## 検証マトリクス

| 対象 | 検証 | status | 記録 |
|---|---|---|---|
| 予測モデル（domain） | Vitest unit: human-like 系列で 50% 超／backoff 境界／null 返却／スコア境界 | ✅ done | predictor.test.ts / score.test.ts（14） |
| ゲーム reducer（features） | Vitest unit: 予測リーク無し／hit・streak・履歴・reset | ✅ done | game.test.ts（6） |
| 永続化（infra） | Vitest unit: 型ガードで壊れた値を初期化（throw しない） | ✅ done | storage.test.ts（4）+ shareCard.test.ts（1） |
| 静的解析 | tsc strict / ESLint / Prettier | ✅ done | commit 前に全通過＝緑 |
| ビルド | `vite build` 成功 | ✅ done | 46 modules / gzip 65KB |
| UI（手動 / preview） | golden path・モバイル幅・a11y | 🟡 partial | preview eval で golden path 確認済（68% 的中・Insight・共有・モデル切替・localStorage）。screenshot ツールは timeout、視覚確認とモバイル幅は未取得 |

## 更新ルール

- 実装で新しいリスクが見つかったらここに検証項目を追加する。
- PoC のコードは `poc/`（使い捨て）。結論は `research/` か spec の `validation.md` に記録し、ここから参照する。
