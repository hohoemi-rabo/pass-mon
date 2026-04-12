# 02: Supabase データベース設計・マイグレーション [DONE]

## 概要

Supabase 上に必要なテーブル、RLS ポリシー、暗号化関数を構築する。

## 対応する要件

- REQUIREMENTS.md ④ セキュリティ方針
- REQUIREMENTS.md ⑧ データベース設計
- REQUIREMENTS.md ⑨ RLS ポリシー設計

## タスク

- [x] pgcrypto 拡張の有効化
- [x] `profiles` テーブルの作成（id, display_name, avatar_url, created_at）
- [x] `credentials` テーブルの作成（id, user_id, service_name, account_id, password_encrypted, pin_encrypted, memo, created_at, updated_at）
- [x] `family_shares` テーブルの作成（id, owner_id, shared_with_id, invite_code, status, created_at）
- [x] 暗号化関数 `encrypt_credential` の作成（AES-256, SECURITY DEFINER）
- [x] 復号関数 `decrypt_credential` の作成（AES-256, SECURITY DEFINER）
- [x] Supabase 環境変数 `app.encryption_key` の設定
- [x] `credentials` テーブルの RLS ポリシー（SELECT: 本人+共有家族, INSERT/UPDATE/DELETE: 本人のみ）
- [x] `family_shares` テーブルの RLS ポリシー（SELECT: 共有元+共有先, INSERT/DELETE: 共有元のみ）
- [x] `profiles` テーブルの RLS ポリシー（本人のみ CRUD）
- [x] 新規ユーザー登録時に `profiles` へ自動挿入するトリガー作成
- [x] TypeScript 型定義の再生成

## 完了条件

- 全テーブルが作成され、RLS が有効になっている
- 暗号化・復号関数が正常に動作する（SQL で検証）
- 管理者ダッシュボードからパスワード平文が見えないことを確認

## 備考

- Supabaseプロジェクト: `pass-mon` (ID: `yvkypckatrheteehwkgh`) を新規作成（game-scopeとは別）
- 暗号化キーは Supabase Vault (`vault.create_secret`) に格納
- `ALTER DATABASE SET` は権限制約で使用不可のため、暗号化関数内で Vault から直接キーを取得する方式に変更
