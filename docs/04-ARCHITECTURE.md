# Architecture

確定した技術構成と設計方針を簡潔に保つ（curated doc）。検討中の技術選定は `app-design/technical.md` で行い、決まった内容だけここへ反映する（二重管理しない）。

## 技術スタック

**このスタック表が実装の唯一の正（pin 後）。** 行の status で段階が変わる:

- **pin 前（行が `📝 draft`）**: この表は本実装(P5)のスタック。**P3 app-design で 0 から検討**（候補は `app-design/technical.md`）し、決まり次第この表に反映 → P3 ゲートで pin。**MVP(P2) の使い捨て技術構成はこの表に載せず `docs/mvp-design/technical.md`** に書く。
- **pin 後（行が `🔍 reviewed`）**: 実装はこの行に従う。逸脱・追加は先に ADR（`docs/decisions/`）起票 → ユーザ承認後に表を更新する。

**pin（確定・固定。定義は `02-GUIDELINES.md`「status 定義」）= ユーザ承認で該当行を `🔍 reviewed` にすること**（**P3 ゲート**で本実装のスタックを確定）。**この表は本実装(P5)のスタック**であり、P2 MVP の使い捨てプロトタイプの技術選定は載せない（MVP のスタックは progress / `mvp/README.md` に軽く記録するだけで、本実装には引き継がない —— 例: 本番モバイルでも MVP はウェブで試した、等）。

| 領域 | 採用 | status | ADR | 根拠 |
|---|---|---|---|---|
| アプリ種別 | Web SPA（完全クライアント・静的配信） | 🔍 reviewed | 0001 | 体験が純クライアントで完結。拡散も Web リンクが最速 |
| 言語 / ランタイム | TypeScript（strict）/ ビルドは Node | 🔍 reviewed | 0001 | ユーザ指定。型で予測ロジックの回帰を防ぐ |
| フロントエンド / 主要フレームワーク | React 19 + Vite 6 | 🔍 reviewed | 0001 | 指定の React。Vite は最小構成で速い。状態は useReducer + 自前 hook |
| バックエンド | なし | 🔍 reviewed | 0001 | クライアントで完結。運用負荷ゼロ |
| データベース | なし（localStorage のみ） | 🔍 reviewed | 0001 | ベストスコア・累計の端末内保存で足りる |
| 認証 | なし | 🔍 reviewed | 0001 | アカウント不要の体験。非スコープ |
| ホスティング | 静的ホスティング（GitHub Pages / Netlify / Vercel いずれも可） | 🔍 reviewed | 0001 | 無料・簡単。配信先は初版で固定しない（引き返せる） |
| 監視 | なし（初版） | 🔍 reviewed | 0001 | 個人開発。必要なら後日 lightweight analytics |
| テスト | Vitest（unit）+ tsc strict + ESLint + Prettier | 🔍 reviewed | 0001 | 予測ロジックの振る舞いを unit で固定 |

## ディレクトリ方針

リポジトリ直下にコードの作業場を持つ。**使い捨て（mvp / poc）と本実装（app）を物理的に分け、本実装は使い捨てコードを引き継がない。**

```text
mvp/   P2 の使い捨て製品プロトタイプ（コンテンツ検証）。綺麗さは問わない。
poc/   使い捨て技術スパイク（実現性・技術課題の検証）。any phase。app/ を汚さない隔離箱。
app/   P5 の本実装。0 から書く。mvp/・poc/ を参照しない。
docs/  設計・進捗・意思決定ログ。
```

本実装(P3 確定)のディレクトリ構造:

```text
app/
  src/
    domain/      予測モデル（ngram-backoff / markov1 / frequency）・スコアリング・型。純粋・副作用なし
    features/    ゲーム状態（useReducer + useOracleGame hook）。domain を組み合わせる
    ui/          画面・コンポーネント（Pads, Stats, AccuracyChart, Insight, ShareCard, Explainer, Settings）
    infra/       localStorage 永続化・PNG エクスポート（Canvas）。副作用を隔離
    shared/      小さなユーティリティ・定数
    main.tsx, App.tsx
```

テストはコロケーション（`*.test.ts` を対象の隣）。domain の振る舞いテストを回帰スイートとして残す。`mvp/` のテストは使い捨てで本実装に引き継がない（詳細は `06-VALIDATION.md`「テストの置き場所と再利用」）。

## レイヤ方針

```text
UI / Screens -> Application / Use cases -> Domain / Models -> Infrastructure / API, DB, Storage
```

依存方向は上から下の一方向。逆流させない。プロジェクト固有の責務・禁止事項は確定後ここに書く。

## 設計判断

重要な判断は ADR に分離する。

| ADR | 内容 |
|---|---|
| [0001](decisions/0001-stack-client-only-react-spa.md) | 本実装スタック: クライアントのみ React+Vite SPA / 永続化 localStorage / 静的配信 / Vitest |

## 未確定事項

- デプロイ先の最終固定（初版は未固定でよい・引き返せる）。
- n-gram 既定 order（P5 実装時に実測で 4 or 5 に決める）。
