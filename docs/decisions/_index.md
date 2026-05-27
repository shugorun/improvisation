# ADR Index

Architecture Decision Records。1 決定 = 1 ファイル。既存 ADR を大きく書き換えず、変更時は新 ADR で supersede する。

## ステータス

- `Proposed` - 提案中
- `Accepted` - 採用
- `Deprecated` - 廃止
- `Superseded by ADR NNNN` - 後続 ADR に置き換え

## 一覧

| # | タイトル | status | 関連 |
|---|---|---|---|
| なし | | | |

## ADR候補（未起票）

ADR 化すべきだが起票が後回しの決定をここにためる（透明性を落とさないため）。出所は progress の「決めたこと」。P3（app-design でスタック pin）でまとめて正式 ADR に昇格する。

| 候補 | 出所（progress 日付） | 対象 | メモ |
|---|---|---|---|
| なし | | | |

## 起票テンプレ

```markdown
# ADR NNNN: <タイトル>

## ステータス
Proposed

## 背景
なぜ決定が必要か。

## 決定
何を決めるか。

## 根拠
なぜそれを選ぶか。代替案との差分。

## 影響
- ポジティブ:
- ネガティブ:
- 中立:

## レビュー
ユーザ承認日 / コメント要旨。

## 関連
- app-design:
- spec:
- issue:
```

## 命名規約

- `NNNN-<kebab-slug>.md`
- 4 桁ゼロ埋め
- 欠番禁止
