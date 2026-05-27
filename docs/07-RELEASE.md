# Release

公開・配布・運用の準備メモ（P6）。アプリ = Oracle（`app/`）。完全クライアントサイド SPA。

## リリースチェックリスト

- [x] プロダクト名と説明が確定している（`01-PRODUCT.md` = Oracle）
- [x] P3 app-design / P4 spec が含む一方通行決定（spec は「なし・Claude 判定」。スタック pin は ADR 0001、`05-PROGRESS.md` レビュー待ちに事後確認余地を明記）
- [x] 主要フロー（`app/`）の検証が完了（unit 25 / build 緑、preview eval で golden path 確認）。**視覚確認・モバイル幅は未取得**（screenshot ツール timeout → 下記ユーザタスク）
- [x] 既知の重大 issue がない（`docs/issues/_index.md` = 0 件）
- [x] 環境変数と secret の扱い: **なし**（完全クライアント・外部送信なし・API キー不要）
- [x] ログ / 監視 / エラー通知方針: 初版は**入れない**（個人開発・非スコープ。必要なら後日 lightweight analytics）
- [x] バックアップ / データ削除方針: サーバ・DB なし。永続化は localStorage（`oracle:v1`）のみで、ユーザがブラウザ側で削除可能
- [~] 利用規約 / プライバシーポリシー: 入力を外部送信しないため最小。公開時に「データは端末内のみ」の一文を添える程度で足りる（follow-up）

## 配布先

| 配布先 | status | メモ |
|---|---|---|
| GitHub Pages | ✅ live | 公開中: https://shugorun.github.io/improvisation/ （2026-05-27 デプロイ成功・HTTP 200 確認）。`.github/workflows/deploy.yml` が `app/**` 変更の push で自動再デプロイ |
| Netlify / Vercel | 📋 任意 | 代替。`app/` を root に、build=`npm run build`、publish=`dist`。`base: './'` 設定済みでサブパス可 |

## 残ユーザタスク（Claude が実行できない）

1. **GitHub Pages を有効化**: リポジトリ Settings → Pages → Source を "GitHub Actions" に。次の push（または手動 workflow_dispatch）で公開。
2. **視覚・モバイル確認**: ローカルで `cd app && npm run dev` を開き、PC/スマホ幅で見た目・タップ操作・各 details セクションを確認（Claude は screenshot ツールが timeout で視覚確認できていない。`09-ENVIRONMENT.md` 参照）。
3. **共有画像の確認**: 「Save result image」で PNG が落ちるか、X/Slack で OGP が出るか。OGP は `https://shugorun.github.io/improvisation/og.svg`（絶対 URL・SVG）。Slack/Discord/Facebook 等は表示可だが **X は SVG の og:image を表示しない** → PNG（1200×630）コピーへの差し替えが follow-up（`og.svg` を元に書き出し）。

## 運用メモ

- サーバ運用なし。デプロイは push → Actions のみ。ロールバックは Pages の再デプロイ（前コミットを push）。
- 入力・スコアは端末内 localStorage のみ。個人情報・secret は扱わない。
