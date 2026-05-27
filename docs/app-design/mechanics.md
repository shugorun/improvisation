# App Mechanics

## 記録方法

- アプリの仕組み、主要フロー、ドメイン概念、ルール、データの流れを書く。
- 仕様として確定した内容は specs にリンクする。
- 仕組みの変更は「更新ログ」に日時付きで残す。

## コア体験

「← / → をできるだけランダムに押す」だけ。Oracle は**あなたが押す前に**次手を予測して確定し、押した瞬間に当否を開示する。当て続けられることで「自分はランダムになれていない」と体感する。

## 主要フロー

| フロー | 入力 | 処理 | 出力 | メモ |
|---|---|---|---|---|
| 1手プレイ | ← / → キー or タップ（= move 0/1） | ① 直前に確定済みの予測 guess を読む ② hit = (guess==move) ③ 統計更新 ④ move を履歴に追加 ⑤ 次手の予測を再確定 | ヒット/ミス表示・精度・ストリーク・スコア・チャート・予測の中身を更新 | 予測は move を見る前に確定（リーク禁止） |
| モデル切替 | モデル選択（ngram/markov1/frequency）・order 変更 | 履歴は保持し、選択モデルで予測器を作り直す | 以降の予測が新モデルに切替（比較できる） | 過去の的中統計はモデル境界で分けるか全体平均かを spec で決める |
| 共有 | 「共有」操作 | 現在のスコア・一言を Canvas に描画 → PNG 化 | 画像ダウンロード / テキストコピー | 完全クライアント。外部送信なし |
| リセット | リセット操作 | 履歴・統計・予測器を初期化（localStorage のベストは残す） | 初期状態 | |

## ドメイン概念

| 概念 | 意味 | 関連 |
|---|---|---|
| Move | 1 手。0=Left / 1=Right | History |
| History | これまでの Move 列 | Predictor の入力 |
| Predictor（Oracle モデル） | History から次手を予測する純関数/クラス。ngram-backoff（既定）/ markov1 / frequency | Round |
| Round | (guess, actual, hit) の 1 試行 | SessionStats |
| SessionStats | rounds / hits / accuracy / streak / predictabilityScore | UI 全般 |
| PredictabilityScore | 的中率を chance=0%・完全予測=100% に正規化した単一指標 | 共有カード |
| ContextInsight | 直近 k 手の文脈に対する予測と信頼度、よく当てる文脈の上位 | 予測の可視化 |

## ルール / アルゴリズム

- **予測の確定タイミング**: 各ラウンド、ユーザの move を観測する前に guess を確定する（情報リークを作らない）。基盤がない初期は coin-flip にフォールバックし、その手は「学習中」と表示する。
- **n-gram backoff（主モデル, Aaronson）**: 直近 `order` 手を文脈キーに、過去に同じ文脈の後に来た move の頻度を数え、多い側を予測。データが無ければ order を 1 ずつ減らしてバックオフ。最終的に基盤が無ければ null（→ coin-flip）。
  - 効率化: 文脈キー→[count0,count1] の Map を**逐次更新**（MVP の毎回全走査 O(n) を O(1)/手 に）。
  - 既定 order は実装時に実測で 4 か 5 に決める（Aaronson は直近 5 手相当）。
- **markov1**: order=1 の特殊形。説明用の比較軸。
- **frequency**: 全体の L/R 比で多い側。「全体頻度では当たらない＝偏りは遷移にある」を見せる教育用。
- **predictabilityScore**: `clamp(round((accuracy - 0.5) / 0.5 * 100), 0, 100)`。十分なラウンド数（例 ≥ 20）でのみ確定表示し、それ未満は「測定中」。

## データの流れ

```text
keydown / tap
  → dispatch(PLAY move)
    → reducer: score against committed guess → update stats/history → recompute next guess via Predictor
      → state
        → UI (pads / feedback / stats / chart / insight / share)
localStorage ← best score / total rounds（副作用は infra 層で）
```

## 例外 / エラー

- 入力は ← / → / タップのみ受理。それ以外のキーは無視（誤爆させない）。
- 連打: 1 ラウンドずつ確定的に処理（イベントを取りこぼさない実装にする）。
- localStorage 不可（プライベートモード等）: 永続化を無効化し、セッション内のみで動作継続（fail soft、機能は止めない）。

## 未確定事項

- [ ] モデル切替時の統計の扱い（全体平均 / モデル別）。spec で確定。
- [ ] チャレンジモードのルール（初版に入れるか）。

## 更新ログ

### 2026-05-27

- 初版。MVP の学び（ngram backoff を主モデル・中核体験の成立）を反映し、本実装の仕組みを定義。
