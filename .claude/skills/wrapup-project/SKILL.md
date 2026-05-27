---
name: wrapup-project
description: 個人開発プロジェクトでセッションを終わるとき、または「終わる」「終了」「wrapup」「手仕舞い」「一区切り」「今日はここまで」と言われたときに使う。作業内容、決定、次タスク、レビュー待ち、index 更新漏れを docs に反映し、次セッションがすぐ再開できる状態にする。
---

# Wrapup Project

セッション終了前の手仕舞い手順。次回の `catchup-project` が正しい現在地を復元できるようにする。

## ゴール

本セッションの成果・判断・未完了事項が `docs/` に漏れなく残っている状態を作る。

## 実行手順

### 1. 週次 progress を特定

- 週番号は手計算せず OS のコマンドで取得する（どちらも `2026-W21` 形式）:
  - Unix系（macOS / Linux）: `date +%G-W%V`（`%G` は ISO 週年なので年境界も正しい）。
  - Windows PowerShell: `"{0}-W{1:D2}" -f (Get-Date).Year, [int](Get-Date -UFormat %V)`（`(Get-Date).Year` は暦年なので、年境界で ISO 週年とずれることがある。結果が前年/翌年の週なら週ファイルの年も合わせる）。
- `docs/progress/<week>.md` がなければ作成する。
- `docs/progress/_index.md` に週次ファイルの行がなければ追加する。

### 2. 本日エントリを追記

週次ファイルにその日のエントリを追記する。その日まだエントリが無ければ `## YYYY-MM-DD`、既にあれば `## YYYY-MM-DD（追記: <作業単位名 or wrapup>）` を**新しく作る**（既存エントリは上書きしない・重複日付で乱立させない）。

```markdown
### やったこと
- ...

### 決めたこと
- ...

### 次やること
- ...
```

### 3. 現在地サマリを更新

`docs/05-PROGRESS.md` の以下を最新化する。

- 現在のフェーズ（P0-P6）とフェーズ進行のチェック
- 現フェーズのゲート（`03-ROADMAP.md`）の達成状況。全チェックならフェーズ移行を記録し、次フェーズのゲートに差し替える
- 進行中
- 次にやること
- レビュー待ち
- 未解決 issue 件数

### 4. 各 index を更新

本セッションの成果物を index に反映する。

- 新規/更新 idea: `docs/ideas/_index.md`
- 新規/更新 app-design: `docs/app-design/_index.md`
- 新規/更新 spec: `docs/specs/_index.md`
- 新規 ADR / ADR候補: `docs/decisions/_index.md`（progress の「決めたこと」で ADR 化すべき判断は「ADR候補」に積む。起票は P3 でまとめて可）
- 新規/解決 issue: `docs/issues/_index.md`
- 新規 research: `docs/research/_index.md`

### 5. レビュー待ちを明示（一方通行決定のみ）

**一方通行（不可逆／高コスト）な決定でユーザ確認が要るものだけ**を `docs/05-PROGRESS.md` のレビュー待ちに列挙する（「見てほしい点 / なぜ一方通行か / 目安時間」を添える）。引き返せる決定は列挙せず、根拠を progress に残して進める。`🔍 reviewed` は含む一方通行決定の確認後にのみ付ける（02-GUIDELINES「レビューゲート」）。

### 6. ファイルサイズを確認

更新した curated doc / ログが 300 行を超えていないか確認する。超えそうなら分割（progress は週次、specs はサブファイル、curated doc はログ側へ退避）を提案する。catchup が肥大化に耐えるための予防。

### 7. commit + push（義務）

セッションを未コミット/未push のまま終えない（次回 catchup のループ原因になる）。実行するコマンドを宣言してから:

```text
git add -A                        # .env 等の secret が .gitignore 済みか確認
git commit -m "[docs] wrapup: <セッションの要約>"
git push
```

- 本セッションの作業単位が checkpoint 済みなら、ここで残った docs 更新分だけを `[docs]` commit する。
- 検証が赤い未完了コードが残っている場合は、その旨を progress「次やること」に書いたうえで commit はするが push は保留してよい。その場合は完了報告でも push 保留を明示する。
- `main` への force push はしない。

### 8. 完了報告

以下の形式で報告する。

```text
[wrapup-project]
✓ progress に本日エントリ追記
✓ 05-PROGRESS.md 更新
✓ index 更新: <更新した index / 変更なし>
✓ レビュー待ち: <件数>
✓ commit + push: <commit hash / push 済 or 保留理由>
- 未解決 issue: <件数>

セッション終了して大丈夫です。
```

## 厳守事項

- 口頭だけで済ませない。チェックを付ける項目は実際にファイルを更新する。
- **未コミット/未push のまま終了しない。** push まで完了させてクリーンな状態で終える。
- 変更がない項目は `-` で報告する。
- 進捗ログを重複日付で乱立させない。
- 何も変更していないセッション（コミット対象なし）なら「変更なし、記録不要」と報告してよい。
