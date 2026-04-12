import { useState } from "react";
import { Text, View } from "react-native";
import { Redirect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/Button";
import { signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { Colors } from "@/constants/theme";

export default function SignIn() {
  const { isLoggedIn } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoggedIn) {
    return <Redirect href="/" />;
  }

  const handleSignIn = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithGoogle();
      // Success: onAuthStateChange will trigger Redirect, no setState needed
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "ログインに失敗しました。もう一度お試しください。",
      );
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="mb-12 items-center">
        <View
          className="mb-6 h-28 w-28 items-center justify-center rounded-full"
          style={{
            backgroundColor: "rgba(212,160,86,0.15)",
            borderWidth: 1.5,
            borderColor: "rgba(212,160,86,0.3)",
          }}
        >
          <Ionicons name="key" size={48} color={Colors.primary} />
        </View>
        <Text
          className="mb-2 text-header font-semibold text-text"
          style={{ letterSpacing: 1 }}
        >
          パスもん
        </Text>
        <Text className="text-center text-body text-subtext">
          かんたん・あんしん{"\n"}パスワード管理
        </Text>
      </View>

      {error ? (
        <View
          className="mb-4 w-full rounded-button p-4"
          style={{
            backgroundColor: "rgba(255,107,107,0.12)",
            borderWidth: 1,
            borderColor: "rgba(255,107,107,0.25)",
          }}
        >
          <Text className="text-center text-body text-danger">{error}</Text>
        </View>
      ) : null}

      <View className="w-full">
        <Button
          title={isLoading ? "ログイン中..." : "Googleでログイン"}
          variant="primary"
          onPress={handleSignIn}
          disabled={isLoading}
        />
      </View>
    </View>
  );
}
