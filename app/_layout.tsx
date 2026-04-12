import "../global.css";
import { ActivityIndicator, Text, View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  MPLUSRounded1c_400Regular,
  MPLUSRounded1c_500Medium,
  MPLUSRounded1c_700Bold,
} from "@expo-google-fonts/m-plus-rounded-1c";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { Colors, FontFamily } from "@/constants/theme";

// Set default font for all Text components globally
const defaultTextStyle = { fontFamily: FontFamily.regular };
const originalRender = (Text as any).render;
if (originalRender) {
  (Text as any).render = function (props: any, ref: any) {
    return originalRender.call(
      this,
      { ...props, style: [defaultTextStyle, props.style] },
      ref,
    );
  };
} else {
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = defaultTextStyle;
}

export default function RootLayout() {
  const auth = useAuthProvider();
  const [fontsLoaded] = useFonts({
    [FontFamily.regular]: MPLUSRounded1c_400Regular,
    [FontFamily.medium]: MPLUSRounded1c_500Medium,
    [FontFamily.bold]: MPLUSRounded1c_700Bold,
  });

  if (auth.isLoading || !fontsLoaded) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 items-center justify-center bg-background">
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AuthContext.Provider value={auth}>
        <Slot />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
