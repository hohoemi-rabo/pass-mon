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
- `components/` — 共通UIコンポーネント
- `hooks/` — カスタムフック
- `lib/` — Supabaseクライアント等のユーティリティ
- `constants/` — テーマ・定数
- `types/` — TypeScript型定義
- `docs/` — 開発チケット（タスク管理）
- `tsconfig.json` で `@/*` → プロジェクトルートのパスエイリアス設定済み

## Supabase MCP

`.mcp.json` でSupabase MCPサーバーが設定済み。`mcp__supabase__*` ツールでDB操作・マイグレーション・SQL実行が可能。

- 組織: `masa-portfolio`
- プロジェクト: `game-scope` (ID: `vhuhazlgqmuihejpiuyy`, リージョン: ap-northeast-1)

## ルール分割（.claude/rules/）

詳細なルールは `.claude/rules/` に分割して管理。対象ファイルに応じて自動ロードされる:

| ルールファイル | 内容 | トリガー |
|---------------|------|---------|
| `expo-best-practices.md` | Expo Router, Supabase連携, パフォーマンス | `app/`, `components/`, `hooks/` |
| `ui-ux-senior.md` | シニア向けUI制約, カラーパレット | `app/`, `components/`, `constants/` |
| `security.md` | 暗号化, RLS, トークン管理 | `lib/`, `hooks/`, `app/` |
| `eas-build.md` | EAS Build設定, 配布 | `eas.json`, `app.json`, `app.config.*` |
| `ticket-management.md` | チケットTODO管理ルール | `docs/` |

## 現在の状態

Expoテンプレートのスキャフォールディング段階。認証・CRUD・暗号化などのコア機能は未実装。
