---
name: catchup-project
description: 汎用個人開発プロジェクトで新規セッションを開始するとき、または「キャッチアップ」「現状把握」「続きから」「今どこ」「次なに」と言われたときに使う。docs の索引、進捗、現フェーズとゲート、未解決 issue、レビュー待ち、進行中の idea/app-design/spec/implementation を読み、短い現在地サマリを返して次の行動に入る。
---

# Catchup Project

新規セッションでプロジェクトの文脈を復元する手順。ユーザに「どれを見るか」を聞かず、リポジトリ内の docs から現在地を復元する。

## ゴール

セッションをまたいでも、前回の続き・レビュー待ち・未解決問題・次の一手を正確に再開できる状態にする。**全ステップを終えてから最後に1回だけ短いサマリを返す**（途中経過は報告しない）。ユーザの指示が具体的ならサマリの後そのまま作業に入る。

## 実行手順

### 0. git 状態を確認（ループ防止・最初に1回）

宣言してから `git status --short` と `git log --oneline -5` を実行する。

- 通常は前回 `/wrapup-project` が commit + push まで終えているのでクリーン。
- 未コミット変更や未push commit が残っていたら、それを現在地として認識し**ループに入らない**。サマリの `[現在地]` に「未コミット作業あり」と明示する。ユーザ依頼が「続き」ならその作業を継続、区切りが良ければ `/checkpoint` で確定してから進む。

### 1. 基本文脈を読む（必読・最小）

これだけは常に読む。

- `docs/00-INDEX.md`
- `docs/02-GUIDELINES.md`
- `docs/05-PROGRESS.md`（現在のフェーズ・現フェーズのゲート・次タスク）
- `docs/03-ROADMAP.md`（フェーズ P0-P6 とゲート定義。現フェーズのゲートが未チェックなら次へ進まない）
- `docs/progress/_index.md` と**最新週**の progress（過去週は参照されたときだけ）

### 2. 作業レーン別の状態を確認（index 一覧のみ）

各 `_index.md` の一覧だけ見る。空（「なし」のみ）なら本文は読まずスキップ。

- `docs/ideas/_index.md` / `docs/app-design/_index.md` / `docs/mvp-design/_index.md`（P2 のとき）/ `docs/specs/_index.md` / `docs/research/_index.md` / `docs/decisions/_index.md`（確定 ADR + 未起票の「ADR候補」の溜まりも確認）/ `docs/issues/_index.md`

`05-PROGRESS.md` に進行中の item が書かれていれば、**その item の本文だけ**全文読む。curated doc 全部・ログ全部は読まない（docs が肥大化しても catchup が回るようにするための予算）。

### 3. 実装文脈を必要分だけ確認

実装中または実装依頼がある場合だけ、以下を確認する。コード作業場は現フェーズで変わる（**P2 は `mvp/`、P5 は `app/`**）。

- `README.md`
- パッケージ定義 (`package.json`, `pyproject.toml`, `Cargo.toml`, etc.)
- **`docs/08-CODING.md`** — コーディング規則。コードを書き始める前に読む。
- **`docs/09-ENVIRONMENT.md`** — クライアント環境・ツール版・環境の制約と回避策。
- **`docs/04-ARCHITECTURE.md` のスタック表** — pin 済み（`🔍 reviewed`）の行には従う。逸脱・新規依存は ADR 先行。本実装スタックの確定は P3（候補は `app-design/technical.md`）。**P2 の使い捨て技術構成は `docs/mvp-design/technical.md`**、選定理由は progress 一行（02-GUIDELINES「意思決定の記録（2層）」）。
- `git status --short`
- 最新 progress に記録された関連ファイル

### 4. 報告形式（最後に1回だけ）

全ステップ完了後に、以下の 4 行以内で返す。

```text
[現在地] <現フェーズ（P0-P6） / 進行中 item / 直前の作業（未コミットがあれば併記）>
[次の行動] <現フェーズのゲートで未チェックの項目、または docs 上の次タスク / ユーザ依頼への次アクション>
[レビュー待ち] <件数と対象。なければ「なし」>
[未解決] <open issue 件数 / 主なリスク>
```

ユーザが「続きからやって」「これ実装して」など具体的な作業依頼を同時に出している場合は、このサマリの後に `/work`（着手前に確認 → 作業単位ごとに進め checkpoint）で進める。

## 厳守事項

- ユーザに「どのファイルを見るか」を聞かない。入口は常に `docs/00-INDEX.md`。
- 途中報告しない。全ステップ完了後に1回だけサマリを出す。
- 未コミット/未push を検知してもループに入らない。現在地として明示し、続行 or `/checkpoint` で確定する。
- 実装は `04-ARCHITECTURE.md` の pin 済みスタックに従う。pin 後の逸脱・新規依存は ADR 先行（探索期は progress 一行で可）。
- レビューは一方通行（不可逆）決定のみユーザ確認。引き返せる決定は進めて progress に根拠を残す。`🔍 reviewed` = 含む一方通行決定の確認済（02-GUIDELINES「レビューゲート」）。
- index と実ファイルが食い違う場合は実ファイルも直接確認し、食い違いを wrapup 対象にする。
- docs が古い/肥大していると判断したら、作業前か作業中に必要な docs 更新・分割を入れる。
