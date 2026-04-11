# 01: 環境構築・プロジェクト基盤セットアップ

## 概要

Expo プロジェクトの基盤を整備する。NativeWind 導入、Supabase クライアント設定、EAS Build 設定、環境変数管理を行う。

## 対応する要件

- REQUIREMENTS.md ③ 技術スタック
- REQUIREMENTS.md ⑩ 配布・運用計画（EAS Build セットアップ）

## タスク

- [ ] NativeWind (Tailwind CSS) のインストールと設定（`tailwind.config.js`）
- [ ] Supabase クライアントパッケージのインストール（`@supabase/supabase-js`, `@react-native-async-storage/async-storage`, `react-native-url-polyfill`）
- [ ] `lib/supabase.ts` に Supabase クライアント初期化コードを作成
- [ ] 環境変数ファイルの設定（`.env` に `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`）
- [ ] `.env` を `.gitignore` に追加
- [ ] `eas.json` の作成（development / preview / production プロファイル）
- [ ] `app.json` を `app.config.ts` に変換し、環境変数による動的設定に対応
- [ ] Supabase 型定義の生成（`types/database.ts`）
- [ ] `expo-secure-store` のインストール
- [ ] テンプレートの不要ファイル整理（example 画面等の削除）

## 完了条件

- `npx expo start` でエラーなく起動する
- Supabase クライアントが正常に接続できる
- NativeWind のクラスが適用される
- EAS Build の preview プロファイルで APK が生成できる
