import "../global.css";
import { ActivityIndicator, View } from "react-native";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const auth = useAuthProvider();

  if (auth.isLoading) {
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
      <StatusBar style="dark" />
      <AuthContext.Provider value={auth}>
        <Slot />
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}
