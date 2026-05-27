# App Development Boilerplate

アイデアの壁打ち → MVP → 詳細設計 → 仕様 → 本実装 → リリースを、判断・詰まり・進捗を docs に残しながら 1 リポジトリで進めるためのボイラープレート。**Claude Code 前提（Windows / macOS / Linux）。** フックは Node スクリプトなので OS を問わず動く。

## このテンプレから始める

1. このリポジトリをテンプレートとして新規プロジェクトを作る。
   - GitHub なら **"Use this template"**。手元からなら:
     ```text
     git clone <this-repo> my-app && cd my-app
     rm -rf .git && git init        # Windows PowerShell: Remove-Item -Recurse -Force .git; git init
     ```
2. Claude Code でプロジェクトを開く。`.claude/` のフックは**信頼確認のプロンプトを承認するまで動かない**。承認すると `SessionStart` の案内が出る。
3. `/catchup-project` を実行 → 作りたいアプリを自然文で送って壁打ち開始。
4. `LICENSE` の著作権者を自分の名前に書き換える（既定は MIT）。

> 既定の権限モードは `acceptEdits`（[.claude/settings.json](.claude/settings.json)）。フォルダ内の編集は自動承認、外は読みのみ、secret と外部書込は拒否。

## フェーズ

順に進み、**各フェーズの移行ゲート（`docs/03-ROADMAP.md`）が全チェックになるまで次に進まない。**

```text
P0 初期化 → P1 アイデア → P2 MVP → P3 app-design → P4 spec → P5 本実装 → P6 リリース
```

- **P2 MVP** は `mvp/` で最小フロント＋中核機能だけを作り、アプリの中核体験（コンテンツ）を確定する使い捨てプロトタイプ。
- **P5 本実装** は `app/` で 0 から書く。MVP のコード/ロジックは引き継がない（適当に書いた MVP を本実装に持ち込まないため）。

## 使い方

新しいセッションはまず catchup。

```text
/catchup-project
```

その後、作りたいこと・直したいことをそのまま書くと、エージェントが `/work`（着手前に確認 → 作業単位ごとにコード/docs を進め、問題→issue・判断→ADR → checkpoint）で進める。

```text
家計簿アプリのアイデアを詰めたい
MVP を mvp/ に作って
ログイン機能を実装して
```

`/work` は着手前に**ユーザがやるべきタスク（アカウント・認証情報・課金など）**を洗い出し、未解決なら先に提示する。作業が一区切りつくたびに `docs/progress/` に 1 エントリ記録して検証が緑なら commit する（push はしない）。

終わる前は wrapup。docs を更新したうえで **commit + push まで**行い、リポジトリをクリーンにして終える。

```text
/wrapup-project
```

## ディレクトリ

- `CLAUDE.md` - 常時ロードの運用契約（短い）。詳細は `docs/02-GUIDELINES.md`。
- `.claude/skills/` - プロジェクト内スキル（`catchup-project` / `work` / `checkpoint` / `wrapup-project`）。
- `.claude/hooks/` - セッション開始・終了フック（クロスプラットフォームな Node `.cjs`）。
- `.claude/settings.json` - フック登録と許可ポリシー。
- `docs/` - 設計・要件・進捗・意思決定ログ（入口は `docs/00-INDEX.md`）。
- `mvp/` - P2 の使い捨て製品プロトタイプ。
- `poc/` - 使い捨て技術スパイク（any phase。結論は research / spec へ）。
- `app/` - P5 の本実装（0 から。mvp/・poc/ を参照しない）。

## ドキュメントの流れ

```text
ideas/        何を作るか（壁打ち）
  -> mvp/ + mvp-design/   最小実装でコンテンツを確定（使い捨て／実験記録）
  -> app-design/    どう作るか（考え中の作業場）
       -> 01-PRODUCT.md / 04-ARCHITECTURE.md  固まった現在の真実
       -> specs/    機能仕様
            -> app/ + 06-VALIDATION.md  本実装 + 検証
```

横断ログ: `progress/`（作業）, `decisions/`（ADR）, `issues/`（解決すべき問題）, `research/`（調査）, `09-ENVIRONMENT.md`（環境の制約・回避策）。

## 環境

- Claude Code 前提。Windows / macOS / Linux で動く。Node は Claude Code が要求するので追加インストール不要。
- フックは `.claude/hooks/*.cjs`、`.claude/settings.json` から `node` で呼ばれる。
- 日付・週番号は手計算せず OS のコマンドで取得する（Unix系: `date +%G-W%V`、Windows: `Get-Date`）。
- クライアント固有の環境情報・環境起因の制約と回避策は `docs/09-ENVIRONMENT.md` に貯める。

## 運用原則

- docs は常に進化する。古くなった docs は実装と同じ変更単位で直す。
- 技術スタックは `docs/04-ARCHITECTURE.md` のスタック表が唯一の正。pin 後の逸脱・追加は ADR 起票 → 承認後に表を更新する。
- 非自明な判断は ADR（`docs/decisions/`）、解決すべき問題は issue（`docs/issues/`）に残す。`/work` が各ステップで起票する。
- レビューは一方通行（不可逆）な決定だけユーザ確認する。引き返せる決定は進めて progress に根拠を残す。
- 作業単位の区切りで `/checkpoint`、セッション終了時は `/wrapup-project`（commit + push まで）。
