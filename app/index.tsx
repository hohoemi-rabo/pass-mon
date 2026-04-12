import { Text, View } from "react-native";
import { Redirect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { user, isLoggedIn, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  if (!isLoggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header title="パスもん" />
      <View className="flex-1 items-center justify-center px-4">
        <Text className="mb-2 text-title font-bold text-text">
          ようこそ！
        </Text>
        <Text className="mb-8 text-body text-subtext">
          {user?.email ?? ""}
        </Text>
        <View className="w-full">
          <Button title="ログアウト" variant="secondary" onPress={signOut} />
        </View>
      </View>
    </View>
  );
}
