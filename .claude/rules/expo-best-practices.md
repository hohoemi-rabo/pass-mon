---
paths:
  - "app/**/*.tsx"
  - "app/**/*.ts"
  - "components/**/*.tsx"
  - "hooks/**/*.ts"
---

# Expo (SDK 54) ベストプラクティス

## 認証と保護ルート

認証状態は `AuthContext` で一元管理。`_layout.tsx` で `useAuthProvider()` を呼び、Provider で子に共有する。各画面では `useAuth()` で Context から読み取り、未認証時は `<Redirect>` でガードする。

```tsx
// app/_layout.tsx
import { AuthContext, useAuthProvider } from '@/hooks/useAuth';

export default function RootLayout() {
  const auth = useAuthProvider();
  if (auth.isLoading) return <LoadingSpinner />;
  return (
    <AuthContext.Provider value={auth}>
      <Slot />
    </AuthContext.Provider>
  );
}

// app/index.tsx（認証必須画面）
const { isLoggedIn } = useAuth();
if (!isLoggedIn) return <Redirect href="/sign-in" />;

// app/sign-in.tsx（未認証専用画面）
const { isLoggedIn } = useAuth();
if (isLoggedIn) return <Redirect href="/" />;
```

**注意:** `useAuth()` の独立インスタンスを各画面で作ると、初期化タイミングのズレでリダイレクトループが発生する。必ず Context 経由で共有すること。

## セッション管理・セキュアストレージ

- ネイティブ: `expo-secure-store` でトークンを安全に保存
- Web: `localStorage` にフォールバック（SSR時は `typeof localStorage` チェック必須）
- `lib/supabase.ts` の `SecureStoreAdapter` で `Platform.OS` 分岐

## Google OAuth フロー

- Web: `signInWithOAuth` でページリダイレクト（ポップアップはCOOPでブロックされる）
- ネイティブ: `WebBrowser.openAuthSessionAsync` でアプリ内ブラウザ
- Web リダイレクト後のハッシュ処理は `useAuthProvider` 内の `handleWebOAuthRedirect` で実行

## Supabase 連携

- Supabaseクライアントは `expo-secure-store` をストレージアダプタとして使用（AsyncStorage ではない）
- `EXPO_PUBLIC_` プレフィックスの環境変数でSupabase URLとAnon Keyを管理
- 秘密情報（暗号化キー等）はクライアントに含めず、Supabase Vault で管理

## コード品質

- `npx expo lint` でExpo最適化済みESLint設定を利用
- `experiments.reactCompiler: true`（有効化済み）により、不要な `useMemo`/`useCallback` を排除可能
- `experiments.typedRoutes: true`（有効化済み）で型安全なルーティング

## パフォーマンス

- `expo-image` を使用（RNの `Image` より高速、キャッシュ内蔵）
- `react-native-reanimated` v4 でUIスレッドアニメーション
- FlatList の `keyExtractor`, `getItemLayout` を適切に設定してリスト性能を確保
- `newArchEnabled: true`（有効化済み）で新アーキテクチャの恩恵を受ける
