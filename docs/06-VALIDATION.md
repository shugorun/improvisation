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
| 未設定 | 未設定 | 📋 todo | |

## 更新ルール

- 実装で新しいリスクが見つかったらここに検証項目を追加する。
- PoC のコードは `poc/`（使い捨て）。結論は `research/` か spec の `validation.md` に記録し、ここから参照する。
