# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**パスもん（Pass-Mon）** — シニア向けアカウント・パスワード・PINコード管理アプリ。
ほほえみラボの生徒（シニア約20名）とその家族が対象。ノート管理からの脱却を目指す。

詳細な要件は `REQUIREMENTS.md` を参照。

## 技術スタック

- **フロントエンド:** Expo 54 (React Native 0.81) + React 19 + TypeScript 5.9
- **ルーティング:** Expo Router 6（ファイルベース、型付きルート有効）
- **スタイリング:** NativeWind (Tailwind CSS)（導入予定、現時点は StyleSheet）
- **バックエンド/DB:** Supabase (PostgreSQL) — MCP接続設定済み
- **認証:** Supabase Auth (Google OAuth) via expo-auth-session
- **暗号化:** Supabase pgcrypto (AES-256サーバーサイド暗号化)
- **配布:** EAS Build → APK直接配布 (Android) / TestFlight (iOS)
- **アニメーション:** react-native-reanimated v4

## よく使うコマンド

```bash
# 開発サーバー起動
npx expo start

# プラットフォーム指定で起動
npx expo start --android
npx expo start --ios
npx expo start --web

# リント
npx expo lint

# APKビルド（EAS）
eas build --platform android --profile preview

# Supabase型定義の生成（MCP経由も可）
# mcp__supabase__generate_typescript_types を使用
```

## アーキテクチャ

### ルーティング構成

Expo Router のファイルベースルーティングを使用。`app/` ディレクトリが画面に対応する。

- `app/_layout.tsx` — ルートレイアウト（ThemeProvider、Stack Navigator）
- `app/(tabs)/` — ボトムタブナビゲーショングループ

要件定義上の最終構成（`REQUIREMENTS.md` ⑬参照）では `(auth)/` グループ配下に一覧・登録・詳細・共有・設定画面を配置する計画。

### テーマ・カラー

要件定義のカラーパレット（`REQUIREMENTS.md` ⑦参照）:
- プライマリ: `#FF8C42`（温かいオレンジ）
- セカンダリ: `#4ECDC4`（ポップなミント）
- 背景: `#FFF8F0`（やわらかいクリーム）
- 危険: `#FF6B6B` / 成功: `#51CF66`

現在 `constants/theme.ts` にはExpoテンプレートのデフォルト色が残っている。

### パス解決

`tsconfig.json` で `@/*` → プロジェクトルートのパスエイリアスが設定済み。

## UI/UXの制約（シニア対応）

- フォントサイズ最小18px、見出し22px以上
- タップ領域最小48x48dp
- WCAG AA準拠のコントラスト比
- カード型UI、角丸、やさしい影

## セキュリティ要件

- パスワード/PINはSupabase pgcrypto (AES-256) でサーバーサイド暗号化
- 暗号化キーはSupabase環境変数で管理（クライアントに保持しない）
- RLSで本人のみCRUD、共有家族は閲覧のみ
- 管理者もパスワード平文にアクセス不可

## Supabase MCP

`.mcp.json` でSupabase MCPサーバーが設定済み。`mcp__supabase__*` ツールでDB操作・マイグレーション・SQL実行が可能。

- 組織: `masa-portfolio`
- プロジェクト: `game-scope` (ID: `vhuhazlgqmuihejpiuyy`, リージョン: ap-northeast-1)

## Expo (SDK 54) ベストプラクティス

### 認証と保護ルート

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

### セッション管理・セキュアストレージ

- ネイティブ: `expo-secure-store` でトークンを安全に保存
- Web: `localStorage` にフォールバック
- `Platform.OS` で分岐するカスタムフック `useStorageState` パターンを採用

### Supabase 連携

```bash
# 必要なパッケージ
npx expo install @supabase/supabase-js @react-native-async-storage/async-storage react-native-url-polyfill
```

- Supabaseクライアント初期化時に `AsyncStorage` をストレージアダプタとして渡す
- `EXPO_PUBLIC_` プレフィックスの環境変数でSupabase URLとAnon Keyを管理
- 秘密情報（暗号化キー等）はクライアントに含めず、EAS SecretsまたはSupabase環境変数で管理

### EAS Build 環境設定

`eas.json` でビルドプロファイルごとに環境変数を分離する:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": { "APP_VARIANT": "development" }
    },
    "preview": {
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "env": { "APP_VARIANT": "preview" }
    },
    "production": {
      "env": { "APP_VARIANT": "production" }
    }
  }
}
```

### コード品質

- `npx expo lint` でExpo最適化済みESLint設定を利用
- `npx expo lint --fix` で自動修正
- `experiments.reactCompiler: true`（app.json で有効化済み）により、不要な `useMemo`/`useCallback` を排除可能
- `experiments.typedRoutes: true`（有効化済み）で型安全なルーティング

### パフォーマンス

- `expo-image` を使用（RNの `Image` より高速、キャッシュ内蔵）
- `react-native-reanimated` v4 でUIスレッドアニメーション
- FlatList の `keyExtractor`, `getItemLayout` を適切に設定してリスト性能を確保
- `newArchEnabled: true`（有効化済み）で新アーキテクチャの恩恵を受ける

## 現在の状態

Expoテンプレートのスキャフォールディング段階。認証・CRUD・暗号化などのコア機能は未実装。
