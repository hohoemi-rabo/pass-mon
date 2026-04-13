# 010: DB設計 — anshin_memos テーブル

> Phase 2 | あんしんメモ機能

## 概要

あんしんメモ用のテーブル・RLS・インデックス・トリガーを作成する。

## TODO

- [ ] `update_updated_at()` トリガー関数の存在確認（なければ作成）
- [ ] `anshin_memos` テーブル作成（マイグレーション）
- [ ] インデックス作成: `idx_anshin_memos_user_display_order`
- [ ] `updated_at` 自動更新トリガー設定
- [ ] RLS 有効化 + ポリシー作成（SELECT/INSERT/UPDATE/DELETE）
- [ ] `types/database.ts` に `anshin_memos` テーブル定義を追加

## 詳細

### テーブル定義

| カラム | 型 | NULL | デフォルト | 説明 |
|--------|-----|------|-----------|------|
| id | uuid | NO | auto | 主キー |
| user_id | uuid | NO | — | FK → profiles.id |
| title | text | NO | — | メモのタイトル |
| body | text | NO | — | メモの本文 |
| display_order | integer | NO | 0 | 表示順（昇順） |
| created_at | timestamptz | NO | now() | 作成日時 |
| updated_at | timestamptz | NO | now() | 更新日時 |

### RLS ポリシー

- SELECT: 本人 OR 共有先家族（family_shares で active）
- INSERT: 本人のみ
- UPDATE: 本人のみ
- DELETE: 本人のみ

### 参照

- 要件定義: `docs/REQUIREMENTS_PHASE2.md` セクション3
