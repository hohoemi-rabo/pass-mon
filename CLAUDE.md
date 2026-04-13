# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

**パスもん（Pass-Mon）** — シニア向けアカウント・パスワード・PINコード管理アプリ。
ほほえみラボの生徒（シニア約20名）とその家族が対象。ノート管理からの脱却を目指す。

詳細な要件は `REQUIREMENTS.md` を参照。

## 技術スタック

- **フロントエンド:** Expo 54 (React Native 0.81) + React 19 + TypeScript 5.9
- **ルーティング:** Expo Router 6（ファイルベース、型付きルート有効）
- **スタイリング:** NativeWind (Tailwind CSS)
- **フォント:** M PLUS Rounded 1c（丸ゴシック、`@expo-google-fonts/m-plus-rounded-1c`）
- **バックエンド/DB:** Supabase (PostgreSQL) — MCP接続設定済み
- **認証:** Supabase Auth (Google OAuth) via expo-auth-session
- **暗号化:** Supabase pgcrypto (AES-256サーバーサイド暗号化)
- **配布:** EAS Build → APK直接配布 (Android) / TestFlight (iOS)
- **アニメーション:** react-native-reanimated v4
- **リスト並び替え:** react-native-draggable-flatlist（長押しドラッグ&ドロップ）

## よく使うコマンド

```bash
npx expo start            # 開発サーバー起動
npx expo start --android  # Android
npx expo start --ios      # iOS
npx expo start --web      # Web
npx expo lint             # リント
npx expo lint --fix       # リント自動修正
eas build --platform android --profile preview  # APKビルド
```

## アーキテクチャ

- `app/` — Expo Router ファイルベースルーティング
- `components/` — 共通UIコンポーネント（`ErrorBanner`, `Button`, `Card`, `Header` 等）
- `hooks/` — カスタムフック（throw-only エラーパターン、内部 state なし）
- `lib/` — ユーティリティ（`supabase.ts`, `auth.ts`, `platform.ts`）
- `constants/` — テーマ・定数（`theme.ts` に `Colors`, `Overlays`, `FontFamily` 等）
- `types/` — TypeScript型定義
- `docs/` — 開発チケット（タスク管理、連番ファイル `0XX_*.md`）
- `scripts/` — アイコン生成スクリプト（SVGソース + sharp変換）
- `tsconfig.json` で `@/*` → プロジェクトルートのパスエイリアス設定済み

## Supabase MCP

`.mcp.json` でSupabase MCPサーバーが設定済み。`mcp__supabase__*` ツールでDB操作・マイグレーション・SQL実行が可能。

- 組織: `masa-portfolio`
- プロジェクト: `pass-mon` (ID: `yvkypckatrheteehwkgh`, リージョン: ap-northeast-1)

## ルール分割（.claude/rules/）

詳細なルールは `.claude/rules/` に分割して管理。対象ファイルに応じて自動ロードされる:

| ルールファイル | 内容 | トリガー |
|---------------|------|---------|
| `expo-best-practices.md` | Expo Router, Supabase連携, パフォーマンス | `app/`, `components/`, `hooks/` |
| `ui-ux-senior.md` | シニア向けUI制約, カラーパレット, フォント | `app/`, `components/`, `constants/` |
| `security.md` | 暗号化, RLS, トークン管理 | `lib/`, `hooks/`, `app/` |
| `eas-build.md` | EAS Build設定, 配布 | `eas.json`, `app.json`, `app.config.*` |
| `ticket-management.md` | チケットTODO管理ルール | `docs/` |

## デザインシステム

### テーマ: ダークネイビー × ウォームゴールド

「上品で落ち着いた、スタイリッシュで迷わない」がコンセプト。

- 背景: `#091b36`（ダークネイビー）
- カード: `#0d2847`（ネイビーサーフェス）+ `Overlays.cardBorder`
- アクセント: `#D4A056`（ウォームゴールド）
- テキスト: `#FFFFFF` / サブテキスト: `#8BA3C4` / プレースホルダー: `#4A6A8C`
- オーバーレイ色は `constants/theme.ts` の `Overlays` 定数を使用（RGBA ハードコード禁止）

### フォント

- **M PLUS Rounded 1c**（丸ゴシック）をグローバル適用
- `_layout.tsx` で `Text.render` をパッチし、全 Text に `fontFamily: "MPlusRounded"` をデフォルト設定
- `constants/theme.ts` の `FontFamily` 定数: `regular` / `medium` / `bold`
- `style` で直接フォント指定する場合は `FontFamily.*` 定数を使用

### 共通コンポーネント

- **ErrorBanner** (`components/ErrorBanner.tsx`): エラーメッセージ表示。全画面で統一使用
- **Header** (`components/Header.tsx`): オプション `onBack` で戻る矢印を表示
- **Button** (`components/Button.tsx`): `primary` / `secondary` / `danger` の3バリアント
- **TextInput** (`components/TextInput.tsx`): `secureTextEntry` 時にパスワード表示切替アイコン付き。プレースホルダーは `Colors.placeholder` で薄く表示
- **CredentialCard** (`components/CredentialCard.tsx`): `drag`/`isActive` props でドラッグ対応。アカウントID未設定時はサブテキスト非表示

### NativeWind × style の注意

- Pressable の `style` コールバック関数と NativeWind `className` は Web で競合することがある
- 確実にスタイルを適用するには、純粋な `style` プロパティのみを使用する（Button, FAB 等で実践済み）

## エラーハンドリングパターン

- **Hook（`useCredentials`, `useFamilyShare`）**: throw のみ。内部に `isLoading` / `error` state を持たない
- **画面コンポーネント**: try-catch でキャッチし、ローカル state でエラーメッセージを管理
- **エラー表示**: `ErrorBanner` コンポーネントを使用

## クロスプラットフォーム対応

- `confirmDialog()` (`lib/platform.ts`): Web は `window.confirm`、ネイティブは `Alert.alert` を自動切替
- `shadow*` スタイルプロパティは RN Web で非推奨 → `boxShadow` CSS shorthand を使用
- `edgeToEdgeEnabled: true`（Android）→ タブバー・コンテンツで SafeArea insets を適用必須
- `softwareKeyboardLayoutMode: "pan"`（Android）→ キーボード表示時にコンテンツをパン

## ナビゲーションの注意

- **非同期処理後のナビゲーション**: `setTimeout(() => router.back(), 50)` で遅延（Hook の cleanup と競合回避）
- **ユーザー操作のナビゲーション**: 即座に `router.back()`
- **認証後のナビゲーション**: `onAuthStateChange` の `access_token` 重複チェックで二重レンダリング防止

## 認証アーキテクチャ

- `hooks/useAuth.ts` に `AuthContext` + `useAuthProvider` + `useAuth` を定義
- `_layout.tsx` で `useAuthProvider()` → `AuthContext.Provider` で全画面に共有
- 各画面は `useAuth()` で Context から認証状態を取得（独立インスタンスは作らない）
- 認証ガードは `app/(auth)/_layout.tsx` で一元化（個別画面での `<Redirect>` は不要）
- `onAuthStateChange`: `access_token` が変わっていなければ setState をスキップ（重複防止）

## レイアウト構成

- `app/_layout.tsx` で `GestureHandlerRootView` + `SafeAreaProvider` + フォント読み込み + `StatusBar`（style="light"）をルートに配置
- フォント読み込み完了まではローディング表示（`fontsLoaded` チェック）
- 各画面で `useSafeAreaInsets()` を使い、ノッチ・ステータスバー領域を動的に回避
- ローディング画面にも `SafeAreaProvider` を適用（早期リターン時の表示崩れ防止）
- タブバーでも `useSafeAreaInsets().bottom` を加算（Android ナビゲーションバー対応）

## ナビゲーション構成

```
app/_layout.tsx          → GestureHandlerRootView + SafeAreaProvider + Font + AuthContext + Slot
├── sign-in.tsx          → 未認証用（ルート直下）
└── (auth)/_layout.tsx   → 認証ガード + Stack
    ├── (tabs)/_layout.tsx → Tabs（ホーム / 共有 / 設定）
    │   ├── index.tsx      → ホーム一覧（DraggableFlatList + 検索 + FAB）
    │   ├── share.tsx      → 家族共有設定
    │   └── settings.tsx   → 設定（ログアウト・バージョン）
    ├── add.tsx            → 新規登録（Stack push、タブ非表示）
    └── [id].tsx           → 詳細・編集（Stack push、タブ非表示、ヘッダー戻るボタン付き）
```

## チケット TODO 管理

- `docs/` 配下のチケットファイル（`0XX_*.md`）で開発タスクを管理
- 未着手: `- [ ]` / 完了: `- [x]`
- **タスクが完了したら即座に `- [ ]` を `- [x]` に更新すること**
- チケット内の全タスクが完了したら、ファイル先頭の `#` タイトルの後に `[DONE]` を付与

## 現在の状態

Phase 1〜6 完了。全機能実装済み、APK ビルド・配布フロー確立済み。
- Phase 1: 環境構築、DB設計、テーマ・UI基盤、Google OAuth認証
- Phase 2: CRUD、一覧検索、タブナビゲーション
- Phase 3: 家族共有（招待コード、閲覧専用、共有解除）
- Phase 4: EAS Build APK配布、セットアップ手順書
- Phase 5: UIリデザイン（ダークネイビー × ゴールド、M PLUS Rounded 1c フォント）
- Phase 6: リファクタリング（ErrorBanner抽出、confirmDialog統一、Hook整理、Overlays定数化、Supabase RLS/関数最適化）
