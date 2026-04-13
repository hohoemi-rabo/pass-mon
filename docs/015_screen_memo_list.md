# 015: 画面 — あんしんメモ一覧（memos.tsx） [DONE]

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモのメイン一覧画面。ホーム画面（index.tsx）と同じパターンで構築する。
DraggableFlatList による並び替え、検索、FAB、家族共有セクションを含む。

## TODO

- [x] `app/(auth)/(tabs)/memos.tsx` 作成
- [x] ヘッダー「あんしんメモ」
- [x] 検索バー（SearchBar、placeholder: "タイトルで検索"）
- [x] DraggableFlatList（通常時）/ FlatList（検索時）切替
- [x] AnshinMemoCard で各メモを表示
- [x] ドラッグ&ドロップ並び替え + DB保存
- [x] 家族の共有メモセクション（リスト下部）
- [x] FAB（`/memo/add` へ遷移）
- [x] 空状態表示（heart-outline アイコン + メッセージ）
- [x] プルリフレッシュ対応
- [x] `useFocusEffect` でフォーカス時に再取得
- [x] エラー表示（ErrorBanner）

## 状態管理

- `memos: AnshinMemoSummary[]`
- `sharedMemos: AnshinMemoSummary[]`
- `isLoading` / `isRefreshing`
- `loadError`
- `searchQuery`

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション5.1
- 既存パターン: `app/(auth)/(tabs)/index.tsx`
