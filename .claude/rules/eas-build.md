---
paths:
  - "eas.json"
  - "app.json"
  - "app.config.*"
---

# EAS Build 環境設定

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

## 配布

- Android: `eas build --platform android --profile preview` → APK ダウンロードリンク配布
- iOS: TestFlight 経由（2名向け）
