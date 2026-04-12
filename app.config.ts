import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "パスもん",
  slug: "pass-mon",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "passmon",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.hohoemi-labo.pass-mon",
  },
  android: {
    package: "com.hohoemilabo.passmon",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    output: "static" as const,
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#FFF8F0",
      },
    ],
    "expo-secure-store",
  ],
  extra: {
    eas: {
      projectId: "e7e1446a-6c84-420e-9eec-c6e23aa1e1ff",
    },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
