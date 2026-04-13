---
paths:
  - "docs/**/*.md"
---

# チケット管理ルール

開発タスクは `docs/` 配下のチケットファイルで管理する。

## TODO 管理

- 未着手: `- [ ]`
- 完了: `- [x]`
- タスクが完了したら即座に `- [ ]` を `- [x]` に更新すること
- チケット内の全タスクが完了したら、ファイル先頭の `# XX:` の後に `[DONE]` を付与する

## チケット一覧

### Phase 1（完了）

| # | ファイル | 内容 |
|---|---------|------|
| 01 | 環境構築 | NativeWind, Supabase クライアント, EAS Build 設定 |
| 02 | DB 設計 | テーブル, RLS, 暗号化関数 |
| 03 | テーマ・UI 基盤 | カラーパレット, コンポーネント, アクセシビリティ |
| 04 | 認証 (F1) | Google OAuth, セッション管理, ログイン画面 |
| 05 | CRUD (F2) | 登録・表示・編集・削除, 暗号化, コピー |
| 06 | 一覧・検索 (F3) | カードリスト, 検索, FAB |
| 07 | 家族共有 (F4) | 招待リンク, 閲覧専用, 共有解除 |
| 08 | ナビゲーション | ルーティング構成, タブ, 設定画面 |
| 09 | ビルド・配布 | APK 生成, 配布, テスト, 手順書 |

### Phase 2（あんしんメモ機能）

| # | ファイル | 内容 |
|---|---------|------|
| 010 | `010_db_anshin_memos.md` | DB テーブル, RLS, インデックス, トリガー |
| 011 | `011_types_anshin_memo.md` | 型定義（AnshinMemo / Summary / FormData） |
| 012 | `012_hook_use_anshin_memos.md` | useAnshinMemos フック（CRUD + 並び替え） |
| 013 | `013_component_anshin_memo_card.md` | AnshinMemoCard コンポーネント |
| 014 | `014_tab_navigation.md` | タブ拡張（3タブ → 4タブ）+ Stack ルート追加 |
| 015 | `015_screen_memo_list.md` | あんしんメモ一覧画面 |
| 016 | `016_screen_memo_add.md` | あんしんメモ新規登録画面 |
| 017 | `017_screen_memo_detail.md` | あんしんメモ詳細・編集画面 |
