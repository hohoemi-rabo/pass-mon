---
paths:
  - "app/**/*.tsx"
  - "app/**/*.ts"
  - "components/**/*.tsx"
  - "hooks/**/*.ts"
---

# Expo (SDK 54) ベストプラクティス

## 認証と保護ルート

Expo Router の `Stack.Protected` を使い、認証状態に応じてルートグループを切り替える。リダイレクト処理は不要で、`guard` の値が変わると自動的にナビゲーションが切り替わる。

```tsx
// app/_layout.tsx
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { isLoggedIn } = useAuthState();

  return (
    <Stack>
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" />
      </Stack.Protected>
      <Stack.Protected guard={!isLoggedIn}>
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}
```

## セッション管理・セキュアストレージ

- ネイティブ: `expo-secure-store` でトークンを安全に保存
- Web: `localStorage` にフォールバック
- `Platform.OS` で分岐するカスタムフック `useStorageState` パターンを採用

## Supabase 連携

```bash
# 必要なパッケージ
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

- Supabaseクライアント初期化時に `AsyncStorage` をストレージアダプタとして渡す
- `EXPO_PUBLIC_` プレフィックスの環境変数でSupabase URLとAnon Keyを管理
- 秘密情報（暗号化キー等）はクライアントに含めず、EAS SecretsまたはSupabase環境変数で管理

## コード品質

- `npx expo lint` でExpo最適化済みESLint設定を利用
- `npx expo lint --fix` で自動修正
- `experiments.reactCompiler: true`（app.json で有効化済み）により、不要な `useMemo`/`useCallback` を排除可能
- `experiments.typedRoutes: true`（有効化済み）で型安全なルーティング

## パフォーマンス

- `expo-image` を使用（RNの `Image` より高速、キャッシュ内蔵）
- `react-native-reanimated` v4 でUIスレッドアニメーション
- FlatList の `keyExtractor`, `getItemLayout` を適切に設定してリスト性能を確保
- `newArchEnabled: true`（有効化済み）で新アーキテクチャの恩恵を受ける
