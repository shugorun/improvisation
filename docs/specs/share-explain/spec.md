# Spec: Share & Explain（共有・説明・永続化）

## status

📝 draft

## 一方通行決定（レビュー対象）

- なし・Claude 判定。localStorage キー（`oracle:best` 等）は小さく fail-soft で移行コストほぼゼロ。共有は外部送信なしのクライアント生成。

## ユーザレビュー

不要（一方通行決定なし）。

## 1. 概要

体験を「人に見せたくなる」形に閉じ、知的な裏付けを与えるセクション。拡散（共有カード）＋深さ（説明）＋継続（ベストスコア保存）。

## 2. スコープ

### 対象

- 共有カード: 現在のスコア＋一言を Canvas に描画 → PNG ダウンロード／テキストコピー。
- 説明（How it works）: Aaronson Oracle / Shannon の読心機 / なぜ人はランダムになれないか（折りたたみ・既定で閉）。
- 永続化: ベストスコア・累計ラウンドを localStorage に保存（アカウントなし）。

### 非対象

- サーバ側リーダーボード・SNS API 連携（非スコープ）。

## 3. UI / UX

```text
Share
  [結果を画像で保存]  [テキストをコピー]
  プレビュー（スコア＋一言＋アプリ名）
Explain（折りたたみ）
  How it works: Aaronson Oracle / Shannon / なぜランダムになれないか
```

- 共有テキスト例: 「The Oracle predicted me 64% of the time. Can you beat it?」＋URL。
- コピー成功時に一時トースト/ラベル（「Copied!」）。

## 4. ユースケース

| # | ユーザ操作 | システム動作 | 結果 |
|---|---|---|---|
| 1 | 「画像で保存」 | 固定サイズ Canvas にスコア・一言・アプリ名を描画 → toBlob → ダウンロード | PNG が保存される |
| 2 | 「テキストをコピー」 | 共有文＋URL を clipboard へ | 「Copied!」表示 |
| 3 | 説明を開く | 解説テキストを表示 | 仕組みを理解 |
| 4 | スコア更新 | ベストを localStorage に保存／読み出し | 再訪時にベストが残る |
| 5 | localStorage 不可 | 永続化を無効化（fail soft） | 機能継続、保存だけ無効 |

## 5. データモデル

```typescript
type Persisted = { best: number; totalRounds: number } // localStorage: "oracle:v1"
// 読み出しは型ガードで検証し、壊れていれば初期化（throw しない）
```

## 6. 状態遷移

```text
share-idle --click--> generating --> done(ダウンロード/コピー)
                                  --> error(握りつぶさず通知, 機能は継続)
```

## 7. API / 外部連携

| Action | 用途 | 認証 |
|---|---|---|
| Clipboard API | テキストコピー | — |
| Canvas toBlob | PNG 生成 | — |
| localStorage | ベスト保存 | — |

外部ネットワーク送信は一切なし。

## 8. エラー / 例外

- Clipboard 不許可: フォールバックで選択可能なテキストを表示。
- toBlob 失敗: エラーを通知（握りつぶさない）、ゲームは継続。
- localStorage 例外: 捕捉して永続化無効化（理由をコメントで明示）。

## 9. 実装方針

- コンポーネント: `ShareCard` / `Explainer`（`ui/`）。Canvas 描画と clipboard/localStorage は `infra/`。
- 共有カードは固定サイズ・システムフォント非依存に近づけ環境差を抑える。
- 永続化は型ガード付き read / write を `infra/storage`。

## 10. 検証

- [ ] Unit: Persisted の型ガード（壊れた値→初期化、throw しない）／ベスト更新ロジック。
- [ ] Manual: PNG が保存できる／コピーが効く／説明が開閉する／localStorage 不可でも落ちない。

## 11. 受け入れ条件

- [ ] 共有カードが PNG 保存でき、内容（スコア・一言・アプリ名）が読める。
- [ ] テキストコピーが動き、成功表示が出る。
- [ ] 説明セクションが開閉し、Aaronson Oracle 等を平易に説明する。
- [ ] ベストスコアが再訪時に残る。localStorage 不可でもアプリは落ちない。

## 12. 未確定事項

- [ ] 共有カードのビジュアル詳細。
- [ ] ベストスコアの定義（最も Oracle を出し抜いた=最低 predictabilityScore か、最長 fool ストリークか）。

## 13. 関連

- app-design: [overview.md](../../app-design/overview.md), [frontend.md](../../app-design/frontend.md)
- spec: stats-insight, core-game
