# 08: ナビゲーション・画面レイアウト構成 [DONE]

## 概要

Expo Router を使ったファイルベースルーティングの最終構成を整備する。タブナビゲーション、認証ガード、モーダル表示を含む。

## 対応する要件

- REQUIREMENTS.md ⑥ 画面構成
- REQUIREMENTS.md ⑬ プロジェクト構成

## タスク

- [x] ルーティング構成の整理
  - [x] `app/_layout.tsx` — ルートレイアウト（SafeAreaProvider + AuthContext）
  - [x] `app/sign-in.tsx` — ログイン画面
  - [x] `app/(auth)/_layout.tsx` — 認証ガード + Stack
  - [x] `app/(auth)/(tabs)/_layout.tsx` — タブナビゲーション
  - [x] `app/(auth)/(tabs)/index.tsx` — ホーム（一覧）
  - [x] `app/(auth)/add.tsx` — 新規登録（Stack push）
  - [x] `app/(auth)/[id].tsx` — 詳細・編集（Stack push）
  - [x] `app/(auth)/(tabs)/share.tsx` — 家族共有設定
  - [x] `app/(auth)/(tabs)/settings.tsx` — 設定
- [x] タブナビゲーションのアイコン・ラベル設定
- [x] 設定画面の作成（ログアウト、バージョン情報）
- [x] `(tabs)` グループの導入（タブ画面 + Stack push の両立）
- [x] ヘッダーのスタイリング（カラーパレット適用）

## 完了条件

- 全画面間のナビゲーションが正常に動作する
- 未ログイン時はログイン画面のみアクセス可能
- タブナビゲーションで主要画面を切り替えられる
- 設定画面からログアウトできる
