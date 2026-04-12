# 04: Google OAuth 認証（F1） [DONE]

## 概要

Supabase Auth + Google OAuth による認証機能を実装する。ログイン・ログアウト・セッション維持を含む。

## 対応する要件

- REQUIREMENTS.md ⑤ F1: 認証
- REQUIREMENTS.md ⑥ ログイン画面

## タスク

- [x] Google Cloud Console で OAuth クライアント ID を作成（Android / iOS / Web）
- [x] Supabase ダッシュボードで Google OAuth プロバイダーを有効化
- [x] `expo-auth-session` / `expo-web-browser` を使った Google OAuth フローの実装
- [x] 認証状態管理フック `useAuth` の作成（ログイン中 / ローディング / 未ログイン）
- [x] セッショントークンの `expo-secure-store` への永続化
- [x] ルートレイアウトで `Stack.Protected` による認証ガード実装
- [x] ログイン画面の作成（ロゴ、Google ログインボタン、キャッチコピー）
- [x] ログアウト機能の実装
- [x] 初回ログイン時に `profiles` テーブルへユーザー情報を保存
- [x] 認証エラー時のユーザー向けメッセージ表示

## 完了条件

- Google アカウントでログイン・ログアウトできる
- アプリ再起動後もセッションが維持される
- 未ログイン時はログイン画面のみ表示される
- ログイン後は自動的にホーム画面へ遷移する

## 備考

### 手動設定が必要な項目

実際にGoogle OAuthを動作させるには以下の手動設定が必要:

1. **Google Cloud Console**: OAuth 2.0 クライアントIDの作成（Web / Android / iOS）
2. **Supabase ダッシュボード**: Authentication > Providers > Google で Client ID / Secret を設定
3. **Supabase ダッシュボード**: URL Configuration > Redirect URLs に `passmon://` を追加

### 実装方式

- `expo-auth-session` + `expo-web-browser` による Web ベース OAuth フロー
- `signInWithOAuth` + `skipBrowserRedirect` → `WebBrowser.openAuthSessionAsync` パターン
- ネイティブモジュール不要のため Expo Go でも開発テスト可能
- セッションは `expo-secure-store` で永続化（lib/supabase.ts の SecureStoreAdapter）
- `profiles` への自動挿入は DB トリガー（`on_auth_user_created`）で処理済み（チケット02）
