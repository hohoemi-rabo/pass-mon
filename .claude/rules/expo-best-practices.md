---
paths:
  - "app/**/*.tsx"
  - "app/**/*.ts"
  - "components/**/*.tsx"
  - "hooks/**/*.ts"
---

# Expo (SDK 54) ベストプラクティス

## ルートレイアウト構成

`_layout.tsx` では以下の順序でプロバイダーをネストする:

```tsx
// app/_layout.tsx
export default function RootLayout() {
  const auth = useAuthProvider();
  if (auth.isLoading) {
    return (
      <SafeAreaProvider>
        <LoadingSpinner />
      </SafeAreaProvider>
    );
  }
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <AuthContext.Provider value={auth}>
        <Slot />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
```

- `SafeAreaProvider` は最外層に配置（ローディング画面含む全パスで必要）
- `StatusBar` は背景色 `#FFF8F0` に合わせて `style="dark"`
- 早期リターン（ローディング等）でも `SafeAreaProvider` を忘れないこと

## SafeArea の適用

- 各画面で `useSafeAreaInsets()` を使い、ノッチ・ステータスバー領域を動的に回避
- `SafeAreaView` よりも `useSafeAreaInsets()` + `style={{ paddingTop: insets.top }}` を推奨（柔軟性が高い）

## 認証と保護ルート

認証状態は `AuthContext` で一元管理。認証ガードは `app/(auth)/_layout.tsx` で一元化されており、`(auth)` グループ内の個別画面では認証チェック不要。

```tsx
// app/(auth)/_layout.tsx — 認証ガード（一箇所で管理）
const { isLoggedIn } = useAuth();
if (!isLoggedIn) return <Redirect href="/sign-in" />;
return <Stack screenOptions={{ headerShown: false }}>...</Stack>;

// app/sign-in.tsx — 未認証専用画面（ルート直下、(auth) の外）
const { isLoggedIn } = useAuth();
if (isLoggedIn) return <Redirect href="/" />;
```

**注意:** `useAuth()` の独立インスタンスを各画面で作ると、初期化タイミングのズレでリダイレクトループが発生する。必ず Context 経由で共有すること。

## ナビゲーション構成

- `(auth)` グループ: Stack ナビゲーター（認証ガード付き）
- `(tabs)` グループ: `(auth)` 内のタブナビゲーター（ホーム / 共有 / 設定）
- `add.tsx`, `[id].tsx`: `(auth)` 直下に配置し、Stack push でタブの上に表示
- タブバーは `useSafeAreaInsets().bottom` を加算して Android ナビゲーションバーとの重なりを防止

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

## コーディング規約（React Best Practices 準拠）

- **バレルインポート禁止**: `import { X } from "@expo/vector-icons"` ではなく `import X from "@expo/vector-icons/X"` で直接インポート（バンドルサイズ削減）
- **明示的条件レンダリング**: `{value && <Component />}` ではなく `{value ? <Component /> : null}` を使用（falsy値の意図しないレンダリング防止）
- **早期リターン・ガード**: 外部API呼び出しの戻り値は使用前に null チェックし、無効な値で処理を続行しない
- **React Compiler 有効**: `useMemo`/`useCallback` の手動追加は不要（自動最適化される）
- **Web 対応 Alert**: `Alert.alert` は Web で動作しない。`Platform.OS === "web"` で `window.confirm` / `window.alert` にフォールバックすること
- **boxShadow 使用**: `shadow*` プロパティ（shadowColor, shadowOffset 等）は RN Web で非推奨。`boxShadow` CSS shorthand を使用する
