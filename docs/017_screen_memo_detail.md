# 017: 画面 — あんしんメモ詳細・編集（memo/[id].tsx）

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモの詳細表示・編集画面。パスワード詳細画面（[id].tsx）と同じパターン。
閲覧モード / 編集モードの切替、本人のみ編集・削除可能。

## TODO

### 閲覧モード
- [ ] `app/(auth)/memo/[id].tsx` 作成
- [ ] ヘッダー: タイトル + 戻るボタン
- [ ] タイトル表示（22px bold）
- [ ] 本文表示（18px、改行対応）
- [ ] 作成日時表示（16px、subtext）
- [ ] 本人のみ: 「編集する」ボタン（secondary）
- [ ] 本人のみ: 「削除する」ボタン（danger）→ 確認ダイアログ → 削除 → router.back()
- [ ] 家族共有: 「閲覧のみ（家族共有）」バッジ表示

### 編集モード
- [ ] ヘッダー: 「編集中」（戻るボタンなし）
- [ ] フォームフィールド（新規登録と同じ構成、既存値プリフィル）
- [ ] 「保存する」ボタン（primary）
- [ ] 「キャンセル」ボタン（secondary）→ フォームリセット → 閲覧モードへ
- [ ] 保存処理: `updateAnshinMemo()` → 成功時、閲覧モードに切替
- [ ] エラー表示（ErrorBanner）

## 状態管理

- `memo: AnshinMemo | null`
- `isEditing` / `isLoading` / `isSaving`
- `loadError` / `saveError`
- `editForm: AnshinMemoFormData`

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション5.4
- 既存パターン: `app/(auth)/[id].tsx`
