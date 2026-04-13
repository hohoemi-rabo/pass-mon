# 016: 画面 — あんしんメモ新規登録（memo/add.tsx） [DONE]

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモの新規登録画面。パスワード登録画面（add.tsx）と同じパターン。

## TODO

- [x] `app/(auth)/memo/add.tsx` 作成
- [x] ヘッダー「あんしんメモを追加」+ 戻るボタン
- [x] タイトル入力（TextInput、label: "タイトル"、placeholder: "例：通帳の場所"）
- [x] 本文入力（TextInput、multiline、numberOfLines: 6、placeholder: "家族に伝えたいことを書いてください"）
- [x] 「保存する」ボタン（primary、タイトルor本文が空でdisabled）
- [x] 「キャンセル」ボタン（secondary）
- [x] バリデーション（タイトル・本文の空チェック）
- [x] 保存処理: `createAnshinMemo()` → 成功時 `setTimeout(() => router.back(), 50)`
- [x] エラー表示（ErrorBanner）
- [x] KeyboardAvoidingView 対応

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション5.3
- 既存パターン: `app/(auth)/add.tsx`
