# Technical Design

## 記録方法

- 技術選定、構成、API、DB、認証、運用リスクを書く。ここは検討中の作業場。
- 確定した技術構成は `04-ARCHITECTURE.md` に反映する。
- 非自明な決定は ADR に分離し、このファイルからリンクする。
- 調査が必要なものは research にトピック単位で記録する。

## プラットフォーム & 言語（本実装。P3 で 0 から決める）

完全クライアントサイドの Web SPA。サーバ・DB・認証を持たず、静的ファイルとして配信する。
理由: アプリは純粋にクライアントで完結する体験（予測ロジックはローカル計算、永続化は端末内で足りる）。サーバを持たないことで運用負荷ゼロ・無料の静的ホスティング・プライバシー（入力を外部送信しない）を同時に得る。これは本実装の要件から導いた選択で、MVP がたまたまウェブだったからではない（MVP の技術選定は引き継がない方針のもと、改めて 0 から確認した）。

| 項目 | 決定 | 候補・トレードオフ | status |
|---|---|---|---|
| アプリ種別 | Web SPA（完全クライアント・静的配信） | Web / モバイル / デスクトップ。体験は Web で十分、拡散も Web リンクが最速 | 確定 |
| 言語 / ランタイム | TypeScript（strict）/ ビルドは Node | ユーザ指定。型安全で予測ロジックの回帰を防げる | 確定 |
| 主要フレームワーク | React 19 + Vite 6 | ユーザ指定の React。Vite は最小構成で速い。状態は useReducer + 自前 hook（外部状態管理ライブラリ不要） | 確定 |

## 技術スタック候補（→ 確定）

| 領域 | 候補 | status | 根拠 |
|---|---|---|---|
| フロントエンド | React 19 + Vite 6 + TypeScript | 確定 | 指定の React。SPA を最小構成で配信 |
| バックエンド | なし | 確定 | 完全クライアントで体験が完結。運用負荷ゼロ |
| データベース | なし（localStorage のみ） | 確定 | ベストスコア・累計の端末内保存で足りる。サーバ不要 |
| 認証 | なし | 確定 | アカウント不要の体験。非スコープ |
| デプロイ | 静的ホスティング（Vite build 成果物。GitHub Pages / Netlify / Vercel いずれも可） | 確定 | 無料・簡単。初版は配信先を固定しない（引き返せる） |
| 監視 | なし（初版） | 確定 | 個人開発。必要なら後日 lightweight analytics |
| テスト | Vitest（unit）+ tsc strict + ESLint + Prettier | 確定 | 予測ロジックの回帰防止が最重要。振る舞いを unit で固定 |

## アーキテクチャ

`04-ARCHITECTURE.md` のレイヤ方針（UI → features → domain → infra）に沿う。

```text
app/
  src/
    domain/      予測モデル（ngram-backoff / markov1 / frequency）・スコアリング・型。純粋・副作用なし
    features/    ゲーム状態（useReducer + useOracleGame hook）。domain を組み合わせる
    ui/          画面・コンポーネント（Pads, Stats, AccuracyChart, Insight, ShareCard, Explainer, Settings）
    infra/       localStorage 永続化・PNG エクスポート（Canvas）。副作用はここに隔離
    shared/      小さなユーティリティ・定数
    main.tsx, App.tsx
```

依存方向: ui → features → domain。infra は features/ui から使い、domain は何にも依存しない（テスト容易）。

## データ設計

- 永続化なし（サーバ）。localStorage キー: `oracle:best`（最高 predictabilityScore を抑えた=最も出し抜いた記録など）/ `oracle:totalRounds`。スキーマは小さく、壊れても fail soft で初期化。
- セッション状態（履歴・統計・予測器）はメモリ内のみ。

## API / 外部連携

- なし。外部送信ゼロ（プライバシー）。共有カードもクライアント生成。

## 認証 / 権限

- なし。

## テスト / 検証

- domain（予測モデル・スコアリング）は純関数として **Vitest で振る舞いテスト**（synthetic な human-like 系列で 50% を有意に上回ること、frequency が偏り遷移を捉えないこと、backoff の境界）。
- features の reducer も unit で（予測リークが無い＝guess は move 観測前に確定、を保証）。
- tsc strict / ESLint / Prettier を commit 前に通す（緑の条件）。
- UI は手動＋ preview で確認（golden path とモバイル幅）。

## 運用 / 監視

- 静的配信のみ。サーバ運用なし。監視は初版なし。

## 技術リスク

| リスク | 影響 | 検証方法 | status |
|---|---|---|---|
| 予測が体感で弱い（モデル/順序が悪い） | 中核体験が薄れる | 実プレイ＋synthetic 系列で order を実測調整（4 or 5） | P5 実装時に検証 |
| 連打でイベント取りこぼし／二重処理 | 統計がズレる | reducer を確定的に・1イベント1ラウンドで unit テスト | P5 |
| 共有 PNG が環境差で崩れる | 拡散品質が落ちる | Canvas 描画を固定サイズ・Web フォント非依存に | P5 |

## 未確定事項

- [ ] n-gram 既定 order（実測で 4 or 5）。
- [ ] デプロイ先の最終固定（初版は未固定でよい）。

## 関連

- ADR: [0001-stack-client-only-react-spa.md](../decisions/0001-stack-client-only-react-spa.md)

## 更新ログ

### 2026-05-27

- 初版。本実装スタックを 0 から確定（クライアントのみ React+Vite SPA / 永続化 localStorage / 静的配信 / Vitest）。`04-ARCHITECTURE.md` を pin、ADR 0001 を起票。
