# Experiments（実験ログ）

## 記録方法

- 「バージョン・設定・結果・学び」を時系列で。1 実験 = 1 エントリ。
- 使ったバージョンは `switches.md` の ID と対応づける。
- 確定した学びは `docs/progress/`（決めたこと）/ `docs/app-design/` に昇格する。

## ログ

### 2026-05-27 — 予測モデル 3 種の的中率比較（中核仮説の検証）

- バージョン / 設定: M-freq / M-mk1 / M-ng3（`switches.md`）。
- 試したこと:
  1. `mvp/sim.ts` で human-like 入力（過交替・連続を避ける擬似人間: 直前2手が同じなら switch 確率 0.8、それ以外 0.65）n=3000 を生成し各モデルの的中率を測定。
  2. 実 UI（localhost:5173）に同型の human-like 系列を 150 回キー入力（preview eval で dispatch）し、既定モデル M-ng3 の的中率を確認。
- 結果（数値・観察）:
  - sim: **frequency 48.7% / markov1 68.7% / ngram 68.5%**（random=50%）。
  - 実 UI: **ngram 64%**（150 round）。赤=捕捉/緑=回避の strip、ライブ精度、フィードバックいずれも正常動作。
  - frequency は遷移の偏りを捉えられず random 同等。markov1 と ngram(order3) は同等の高精度。
- 学び / 次の一手:
  - **中核体験「読まれて驚く」は成立**。単純操作で Oracle が 50% を大きく上回って当て続ける。
  - 本実装では **ngram backoff を主モデル**にする（一般化に強く、order を将来伸ばせる）。markov1 は説明用の比較軸として残す価値あり。frequency は教育目的（"全体頻度では当たらない＝偏りは遷移にある"を見せる）以外は不要。
  - 昇格先: `docs/app-design/`（採用モデル方針）/ `docs/progress/`（決めたこと）。
