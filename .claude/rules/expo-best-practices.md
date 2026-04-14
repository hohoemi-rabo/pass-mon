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
  const [fontsLoaded] = useFonts({...});
  if (auth.isLoading || !fontsLoaded) {
    return (
      <SafeAreaProvider>
        <LoadingSpinner />
      </SafeAreaProvider>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <AuthContext.Provider value={auth}>
          <Slot />
        </AuthContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

- `GestureHandlerRootView` は最外層に配置（`react-native-draggable-flatlist` に必須、`style={{ flex: 1 }}` を忘れないこと）
- `SafeAreaProvider` はその内側に配置（ローディング画面含む全パスで必要）
- `StatusBar` は背景色 `#091b36` に合わせて `style="light"`
- フォント読み込み（`useFonts`）完了までローディング表示
- `Text.render` パッチでグローバルフォント適用（フォント読み込み前に実行）
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

**認証後の二重レンダリング防止:** `onAuthStateChange` で `access_token` が変わっていなければ setState をスキップする。

## ナビゲーション構成

- `(auth)` グループ: Stack ナビゲーター（認証ガード付き）
- `(tabs)` グループ: `(auth)` 内のタブナビゲーター（ホーム / 共有 / 設定）
- `add.tsx`, `[id].tsx`: `(auth)` 直下に配置し、Stack push でタブの上に表示
- `[id].tsx`: Header に `onBack` で戻る矢印を表示（閲覧モード時のみ）
- タブバーは `useSafeAreaInsets().bottom` を加算して Android ナビゲーションバーとの重なりを防止

## ナビゲーションパターン

- **非同期処理（save/delete）後**: `setTimeout(() => router.back(), 50)` — Hook の finally ブロックが完了してから遷移
- **ユーザー操作（キャンセル/戻る）**: 即座に `router.back()`
- **ログイン成功後**: `onAuthStateChange` → Redirect（sign-in.tsx で `setIsLoading(false)` しない）

## エラーハンドリングパターン

- **Hook（`useCredentials`, `useFamilyShare`）**: 内部に `isLoading` / `error` state を持たない。エラーは throw のみ
- **画面コンポーネント**: try-catch でキャッチし、ローカル state でエラーメッセージを管理
- **エラー表示**: `ErrorBanner` コンポーネントを使用（個別にスタイルを書かない）

## クロスプラットフォームユーティリティ

- **`confirmDialog()`** (`lib/platform.ts`): 確認ダイアログ。Web は `window.confirm`、ネイティブは `Alert.alert` を自動切替。3画面で使用（削除・共有解除・ログアウト）
- **Web 対応 Alert**: 単発の Alert も `Platform.OS === "web"` で `window.alert` にフォールバック

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
- ホーム一覧は `DraggableFlatList`（`react-native-draggable-flatlist`）で長押しドラッグ並び替え対応。検索中は通常 `FlatList` にフォールバック
- **DraggableFlatList の Web スクロール対応**: `containerStyle={{ flex: 1 }}` + `style={{ flex: 1 }}` を必ず指定。内部の `Animated.View` コンテナに高さ制約がないと Web でスクロールできない。リスト親要素にも `style={{ flex: 1, minHeight: 0 }}` を設定（CSS Flexbox の `min-height: auto` 問題を回避）
- `credentials` / `anshin_memos` テーブルの `display_order` カラムで並び順を永続化（`display_order ASC` でソート、新規作成は `display_order: 0` でリスト先頭）
- ホーム画面は `SegmentControl` でパスワード/あんしんメモを切替。セグメントごとに独立した検索・ドラッグ・FAB遷移先
- あんしんメモの `body_encrypted` は一覧で取得せず、詳細画面でのみ復号（一覧のパフォーマンス確保）
- `newArchEnabled: true`（有効化済み）で新アーキテクチャの恩恵を受ける

## コーディング規約（React Best Practices 準拠）

- **バレルインポート禁止**: `import { X } from "@expo/vector-icons"` ではなく `import X from "@expo/vector-icons/X"` で直接インポート（バンドルサイズ削減）
- **明示的条件レンダリング**: `{value && <Component />}` ではなく `{value ? <Component /> : null}` を使用（falsy値の意図しないレンダリング防止）
- **早期リターン・ガード**: 外部API呼び出しの戻り値は使用前に null チェックし、無効な値で処理を続行しない
- **React Compiler 有効**: `useMemo`/`useCallback` の手動追加は不要（自動最適化される）
- **boxShadow 使用**: `shadow*` プロパティ（shadowColor, shadowOffset 等）は RN Web で非推奨。`boxShadow` CSS shorthand を使用する
- **NativeWind × style 競合回避**: Pressable の `style` コールバック関数と NativeWind `className` は Web で競合する場合がある。確実にスタイルを適用する必要がある箇所（Button, FAB 等）では NativeWind を使わず純粋 `style` を使用する
- **キーボード対応**: フォーム画面では `KeyboardAvoidingView` + `ScrollView` を使用。Android は `softwareKeyboardLayoutMode: "pan"` 設定済み
