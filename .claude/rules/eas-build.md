---
paths:
  - "eas.json"
  - "app.json"
  - "app.config.*"
---

# EAS Build 環境設定

## ビルドプロファイル

- `development`: 開発クライアント（内部配布）
- `preview`: APK 生成（`buildType: "apk"`、内部配布）→ 生徒さんへの直接配布用
- `production`: AAB 生成（Play Store / TestFlight 用）

## 環境変数

- `APP_VARIANT`: `eas.json` の `env` で各プロファイルに設定
- `EXPO_PUBLIC_SUPABASE_URL` / `EXPO_PUBLIC_SUPABASE_ANON_KEY`: **EAS Secrets** で管理（`eas.json` には記載しない）
- ローカル開発は `.env` ファイルから読み込み

## EAS プロジェクト

- アカウント: `hohoemirabo`
- プロジェクト ID: `e7e1446a-6c84-420e-9eec-c6e23aa1e1ff`（`app.config.ts` の `extra.eas.projectId`）

## 配布

- Android: `eas build --platform android --profile preview` → APK ダウンロードリンク配布
- iOS: TestFlight 経由（2名向け）
- 手順書: `docs/setup-guide.md`
