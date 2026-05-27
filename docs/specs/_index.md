# Specs Index

機能別仕様の一覧。

## ステータス

- `📋 todo` - 未着手
- `📝 draft` - 草案
- `🔍 reviewed` - 含む一方通行決定をユーザ確認済
- `🚧 implementing` - 実装中
- `✅ done` - 初版完了
- `superseded` - 後続に置き換え

## 一覧

| ID | 機能 | slug | status | 関連 app-design | 実装状況 |
|---|---|---|---|---|---|
| S-1 | コアゲーム（← / → 予測ループ） | [core-game](core-game/spec.md) | ✅ done | mechanics, frontend | 実装済（`app/` P5・動作確認） |
| S-2 | 予測モデル（ngram/markov1/frequency＋スコア） | [prediction-models](prediction-models/spec.md) | ✅ done | mechanics, technical | 実装済（domain・unit 緑） |
| S-3 | 統計と予測の可視化（チャート・Insight） | [stats-insight](stats-insight/spec.md) | ✅ done | frontend, mechanics | 実装済（動作確認） |
| S-4 | 共有・説明・永続化 | [share-explain](share-explain/spec.md) | ✅ done | overview, frontend | 実装済（localStorage 確認・共有は手動確認） |

## ファイル構造

```text
docs/specs/<feature-slug>/
  spec.md
  states.md      # 必要な場合
  api.md         # 必要な場合
  ux.md          # 必要な場合
  validation.md  # 必要な場合
```

## テンプレート

新しい spec は [_TEMPLATE.md](_TEMPLATE.md) を元に作成する。
