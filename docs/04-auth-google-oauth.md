# 04: Google OAuth 認証（F1）

## 概要

Supabase Auth + Google OAuth による認証機能を実装する。ログイン・ログアウト・セッション維持を含む。

## 対応する要件

- REQUIREMENTS.md ⑤ F1: 認証
- REQUIREMENTS.md ⑥ ログイン画面

## タスク

- [ ] Google Cloud Console で OAuth クライアント ID を作成（Android / iOS / Web）
- [ ] Supabase ダッシュボードで Google OAuth プロバイダーを有効化
- [ ] `expo-auth-session` / `expo-web-browser` を使った Google OAuth フローの実装
- [ ] 認証状態管理フック `useAuth` の作成（ログイン中 / ローディング / 未ログイン）
- [ ] セッショントークンの `expo-secure-store` への永続化
- [ ] ルートレイアウトで `Stack.Protected` による認証ガード実装
- [ ] ログイン画面の作成（ロゴ、Google ログインボタン、キャッチコピー）
- [ ] ログアウト機能の実装
- [ ] 初回ログイン時に `profiles` テーブルへユーザー情報を保存
- [ ] 認証エラー時のユーザー向けメッセージ表示

## 完了条件

- Google アカウントでログイン・ログアウトできる
- アプリ再起動後もセッションが維持される
- 未ログイン時はログイン画面のみ表示される
- ログイン後は自動的にホーム画面へ遷移する
