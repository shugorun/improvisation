# Architecture

確定した技術構成と設計方針を簡潔に保つ（curated doc）。検討中の技術選定は `app-design/technical.md` で行い、決まった内容だけここへ反映する（二重管理しない）。

## 技術スタック

**このスタック表が実装の唯一の正（pin 後）。** 行の status で段階が変わる:

- **pin 前（行が `📝 draft`）**: この表は本実装(P5)のスタック。**P3 app-design で 0 から検討**（候補は `app-design/technical.md`）し、決まり次第この表に反映 → P3 ゲートで pin。**MVP(P2) の使い捨て技術構成はこの表に載せず `docs/mvp-design/technical.md`** に書く。
- **pin 後（行が `🔍 reviewed`）**: 実装はこの行に従う。逸脱・追加は先に ADR（`docs/decisions/`）起票 → ユーザ承認後に表を更新する。

**pin（確定・固定。定義は `02-GUIDELINES.md`「status 定義」）= ユーザ承認で該当行を `🔍 reviewed` にすること**（**P3 ゲート**で本実装のスタックを確定）。**この表は本実装(P5)のスタック**であり、P2 MVP の使い捨てプロトタイプの技術選定は載せない（MVP のスタックは progress / `mvp/README.md` に軽く記録するだけで、本実装には引き継がない —— 例: 本番モバイルでも MVP はウェブで試した、等）。

| 領域 | 採用 | status | ADR | 根拠 |
|---|---|---|---|---|
| アプリ種別 | 未設定 | 📝 draft | | |
| 言語 / ランタイム | 未設定 | 📝 draft | | |
| フロントエンド / 主要フレームワーク | 未設定 | 📝 draft | | |
| バックエンド | 未設定 | 📝 draft | | |
| データベース | 未設定 | 📝 draft | | |
| 認証 | 未設定 | 📝 draft | | |
| ホスティング | 未設定 | 📝 draft | | |
| 監視 | 未設定 | 📝 draft | | |
| テスト | 未設定 | 📝 draft | | |

## ディレクトリ方針

リポジトリ直下にコードの作業場を持つ。**使い捨て（mvp / poc）と本実装（app）を物理的に分け、本実装は使い捨てコードを引き継がない。**

```text
mvp/   P2 の使い捨て製品プロトタイプ（コンテンツ検証）。綺麗さは問わない。
poc/   使い捨て技術スパイク（実現性・技術課題の検証）。any phase。app/ を汚さない隔離箱。
app/   P5 の本実装。0 から書く。mvp/・poc/ を参照しない。
docs/  設計・進捗・意思決定ログ。
```

本実装内のレイヤ・ディレクトリ詳細はスタック確定後（P3-P5）に下記を具体化する。

```text
app/
  app/        UI / Screens
  features/   Application / Use cases
  domain/     Models
  infra/      API, DB, Storage
  shared/
```

テストの配置は言語・スタックの慣習に従って P3 で決める（コロケーション or `app/tests/` 等）。本実装(`app/`)のテストは回帰スイートとして残す。`mvp/` のテストは使い捨てで本実装に引き継がない（詳細は `06-VALIDATION.md`「テストの置き場所と再利用」）。

## レイヤ方針

```text
UI / Screens -> Application / Use cases -> Domain / Models -> Infrastructure / API, DB, Storage
```

依存方向は上から下の一方向。逆流させない。プロジェクト固有の責務・禁止事項は確定後ここに書く。

## 設計判断

重要な判断は ADR に分離する。

| ADR | 内容 |
|---|---|
| 未設定 | |

## 未確定事項

- 技術スタック / データ永続化 / 認証の有無 / デプロイ先 / テスト方針
