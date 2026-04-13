---
paths:
  - "lib/**/*.ts"
  - "hooks/**/*.ts"
  - "app/**/*.tsx"
---

# セキュリティ要件

- パスワード/PIN/あんしんメモ本文はSupabase pgcrypto (AES-256) でサーバーサイド暗号化
- 暗号化キーはSupabase Vault (`vault.create_secret`) で管理（クライアントに保持しない）
- 暗号化関数 (`encrypt_credential`/`decrypt_credential`) は `SECURITY DEFINER` + `SET search_path = public`
- RLSで本人のみCRUD、共有家族は閲覧のみ
- 管理者もパスワード平文にアクセス不可
- `EXPO_PUBLIC_` 環境変数には秘密情報を含めない（クライアントに露出するため）
- トークンは `expo-secure-store` で保存（AsyncStorage は使わない）
- `SECURITY DEFINER` 関数には必ず `SET search_path = public` を付与（デフォルトの search_path ではテーブルが見つからない）
- `accept_family_invite` RPC も `SECURITY DEFINER`（家族側が RLS を迂回して招待を受諾するため）
- EAS Build の環境変数は EAS Secrets で管理（`eas.json` に直接記載しない）
- あんしんメモの `body_encrypted` は一覧で取得しない（詳細画面でのみ復号 → 一覧表示が軽量）
- Vercel デプロイ時も `EXPO_PUBLIC_*` 以外の秘密情報はクライアントに含めない
