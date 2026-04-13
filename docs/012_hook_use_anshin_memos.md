# 012: カスタムフック — useAnshinMemos

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモの CRUD + 並び替えを行うカスタムフックを作成する。
`useCredentials` と同じパターン（throw-only、内部 state なし）。

## TODO

- [ ] `hooks/useAnshinMemos.ts` 作成
- [ ] `listAnshinMemos()` — 自分のメモ一覧（display_order ASC）
- [ ] `listSharedAnshinMemos()` — 家族の共有メモ一覧
- [ ] `getAnshinMemo(id)` — メモ詳細取得
- [ ] `createAnshinMemo(form)` — 新規作成（display_order: 0）
- [ ] `updateAnshinMemo(id, form)` — 更新
- [ ] `updateAnshinMemoOrder(items)` — 並び順一括更新
- [ ] `deleteAnshinMemo(id)` — 削除

## パターン

- credentials フックと同じ: 全関数はエラー時に throw
- 暗号化処理なし（平文保存）→ 直接 Supabase クエリ
- 画面側で try-catch してエラーを管理

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション6
- 既存パターン: `hooks/useCredentials.ts`
