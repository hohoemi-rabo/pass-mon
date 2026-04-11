---
paths:
  - "lib/**/*.ts"
  - "hooks/**/*.ts"
  - "app/**/*.tsx"
---

# セキュリティ要件

- パスワード/PINはSupabase pgcrypto (AES-256) でサーバーサイド暗号化
- 暗号化キーはSupabase環境変数で管理（クライアントに保持しない）
- RLSで本人のみCRUD、共有家族は閲覧のみ
- 管理者もパスワード平文にアクセス不可
- `EXPO_PUBLIC_` 環境変数には秘密情報を含めない（クライアントに露出するため）
- トークンは `expo-secure-store` で保存（AsyncStorage は使わない）
