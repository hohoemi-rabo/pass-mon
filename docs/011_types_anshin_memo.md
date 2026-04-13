# 011: 型定義 — あんしんメモ [DONE]

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモ関連の TypeScript 型定義を追加する。

## TODO

- [x] `types/anshinMemo.ts` 作成（AnshinMemo / AnshinMemoSummary / AnshinMemoFormData）
- [x] `types/database.ts` の型と整合性確認

## 型定義

### AnshinMemo（完全データ）

```typescript
{
  id: string;
  user_id: string;
  title: string;
  body: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}
```

### AnshinMemoSummary（リスト表示用）

```typescript
{
  id: string;
  title: string;
  body: string;       // プレビュー用に全文取得、表示時に2行に切り詰め
  display_order: number;
  created_at: string;
}
```

### AnshinMemoFormData（作成/更新フォーム入力）

```typescript
{
  title: string;
  body: string;
}
```

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション4
