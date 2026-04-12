import "../global.css";
import { ActivityIndicator, View } from "react-native";
import { Slot } from "expo-router";
import { AuthContext, useAuthProvider } from "@/hooks/useAuth";
import { Colors } from "@/constants/theme";

export default function RootLayout() {
  const auth = useAuthProvider();

  if (auth.isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={auth}>
      <Slot />
    </AuthContext.Provider>
  );
}
