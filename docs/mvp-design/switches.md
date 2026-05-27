# Switches（切り替え管理）

実験で比較・切り戻したいバージョンの台帳。**動いていた状態を壊さない**ための可逆性の要。

## 記録方法

- バージョンを作ったらここに登録する（ID・対象・場所 / 切替方法・status）。
- 機構は問わない —— config / フラグでパラメータ化でも、`mvp/backend/<variant>/` 等に並置でもよい。**切替えと比較ができればよい**。
- 結果は `experiments.md` に。不要になったバージョンは status を `retired` にする（消す前に retired で残し、必要なら戻せるように）。

## バージョン一覧

| ID   | 対象（予測モデル） | 場所 / 切替方法 | status | メモ |
| ---- | ------------------ | --------------- | ------ | ---- |
| M-freq | Frequency（全体の L/R 比で多い側を予測） | `mvp/src/oracle.ts` `predictFrequency` / UI の Model ボタン | candidate | 遷移の偏りを捉えず、human-like には無力（≈50%） |
| M-mk1 | Markov-1（直前 1 手から予測） | 同上 `predictByContext(_,1)` | candidate | 過交替バイアスを直接捉える。最も高精度 |
| M-ng3 | N-gram backoff order=3（Aaronson） | 同上 `predictNgram`（`NGRAM_ORDER=3`） | active | UI 既定。長文脈→短文脈にバックオフ。Markov-1 と同等の精度で、より一般化に強い |

status: `active`（現用） / `candidate`（比較中） / `retired`（不要・参照用に残置）

status: `active`（現用） / `candidate`（比較中） / `retired`（不要・参照用に残置）
