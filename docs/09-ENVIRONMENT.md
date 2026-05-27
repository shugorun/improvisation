# Environment

## 定義

**environment = クライアント環境の恒久的な事実**（OS・シェル・ランタイム / SDK の版）**と、環境起因の制約・回避策**。コードを直しても消えない、マシン / ツール側の性質。`/work` のコーディング前に読む。

- **書く**: 確認できた環境の事実 / 環境起因で詰まったときの原因と回避策。推測で書かず、確認できた事実だけ。
- **閉じない**: 解決して消すものではなく、知識として蓄積する（同じ環境で同じ失敗を繰り返さないため）。
- **issue との違い**: コード / 設定を直せば消える問題は issue（`docs/issues/`）。直しても消えない制約はここ。

## クライアント / OS

| 項目 | 値 |
|---|---|
| OS | Windows 11 Home (10.0.26200) |
| シェル | PowerShell（Bash ツールは Git Bash `/usr/bin/bash`。`2>$null` 等の PS 構文は Bash では不可、`2>/dev/null` を使う） |
| パッケージマネージャ | npm |

## ツールチェーン / バージョン

実装で使うランタイム・SDK・主要ツールの確認済みバージョン。新しい言語/ツールを入れたら追記する。

| ツール | バージョン | メモ |
|---|---|---|
| Node | v24.15.0 | ネイティブ TS 型ストリップ可（`node sim.ts` が動く）。`app/` は Vite 6 + React 19 |
| npm | 11.12.1 | |

## 既知の制約と回避策

踏んだ環境起因の失敗をここに記録する（例: シェル依存コマンド、SDK / モジュールのバージョン不整合、ビルドツールの前提）。

| 症状 | 原因 | 回避策 | 日付 |
|---|---|---|---|
| Claude Preview の `preview_screenshot` が `app/`（5174）で 30s timeout（`oracle-mvp` 5173 では成功） | 不明（renderer 側の取得ハング。コンソールにエラーなし、`preview_eval` は即応答） | `preview_eval` で DOM・状態を読んで機能検証する。視覚確認は手動ブラウザで | 2026-05-27 |
| `vite` と `vitest` 同梱 vite の型が衝突（`test` フィールドや plugins 型不一致） | vitest が別バージョンの vite を nested 解決 | `vite.config.ts`(plugins) と `vitest.config.ts`(test) を分離。後者は tsconfig include 外 | 2026-05-27 |

## メモ

- シェル依存のコマンドは OS に合わせる（例: 週番号 Unix `date +%G-W%V` / Windows PowerShell `"{0}-W{1:D2}" -f (Get-Date).Year, [int](Get-Date -UFormat %V)`）。
