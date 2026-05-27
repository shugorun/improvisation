# Documentation Index

このプロジェクトの入口。新セッションの `/catchup-project` はここから読む。常時ロードの運用契約はルートの `CLAUDE.md`、運用ルールの詳細は `02-GUIDELINES.md`。

## 必読順

番号はファイル ID であって読む順ではない。下記の順で読む。

1. [05-PROGRESS.md](05-PROGRESS.md) - 現在地、次タスク、現フェーズのゲート
2. [03-ROADMAP.md](03-ROADMAP.md) - フェーズ（P0-P6）と移行ゲート
3. [02-GUIDELINES.md](02-GUIDELINES.md) - 運用ルールの単一の正（記録 / レビュー / status / commit）
4. [01-PRODUCT.md](01-PRODUCT.md) - プロダクトの仮説、対象ユーザ、価値
5. [04-ARCHITECTURE.md](04-ARCHITECTURE.md) - 技術構成、スタック表、ディレクトリ方針
6. [06-VALIDATION.md](06-VALIDATION.md) - テスト、検証、受け入れ基準
7. [07-RELEASE.md](07-RELEASE.md) - リリース準備、公開チェック
8. [08-CODING.md](08-CODING.md) - コーディング規則（実装時に読む）
9. [09-ENVIRONMENT.md](09-ENVIRONMENT.md) - クライアント環境・ツール版・環境の制約と回避策（実装時に読む）

## 成長するフォルダ

- [ideas/](ideas/) - 何を作るかのアイデア壁打ち。1 アイデア = 1 ファイル
- [mvp-design/](mvp-design/) - P2 MVP の実験記録（スコープ・実験・切替・フィードバック・問題）。生ログはここ、確定学びは app-design / progress へ昇格
- [app-design/](app-design/) - 作ると決めた 1 つのアイデアの詳細設計（考え中の作業場。固まったら `01-PRODUCT` / `04-ARCHITECTURE` に反映）
- [specs/](specs/) - 機能別仕様
- [decisions/](decisions/) - ADR。1 決定 = 1 ファイル
- [issues/](issues/) - このプロジェクトの解決すべき問題（不具合・ブロッカー。`open/` / `resolved/`）
- [progress/](progress/) - 週次作業ログ
- [research/](research/) - 技術調査、競合調査、参考資料

## コードの作業場（docs の外・リポジトリ直下）

- `mvp/` - P2 の使い捨て製品プロトタイプ（コンテンツ検証）。本実装に引き継がない。
- `poc/` - 使い捨て技術スパイク（実現性検証）。any phase。結論は research / spec へ。本実装に引き継がない。
- `app/` - P5 の本実装。0 から書く（mvp/・poc/ を参照しない）。

## スキル

明示的に使うプロジェクト内スキル。

- `/catchup-project` - セッション開始時の現在地復元
- `/work` - 自然文の作業依頼の既定フロー（着手前に確認 → 作業単位ごとに進め、問題→issue・判断→ADR → checkpoint）
- `/checkpoint` - 作業単位の区切りで progress 追記 + 緑なら commit（`/work` の④。境界では自動実行）
- `/wrapup-project` - セッション終了時の記録更新 + commit + push

## ファイル運用

- 1 ファイルが 300 行を超えそうなら分割を検討する。
- `_index.md` は配下のファイルを一覧化する。
- 日時は推測せず OS のコマンドで取得した値を使う（Unix系: `date`、Windows: `Get-Date`）。時刻が不要な箇所は日付のみでよい。
- 命名:
  - idea: `<idea-slug>.md`
  - research: `<topic-slug>.md`
  - ADR / issue: `NNNN-<slug>.md`
  - spec: `docs/specs/<feature-slug>/spec.md`
  - progress: `YYYY-Www.md`
