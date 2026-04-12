import { useState } from "react";
import { Text, View } from "react-native";
import { Redirect } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Button } from "@/components/Button";
import { signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

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
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "ログインに失敗しました。もう一度お試しください。",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-background px-8">
      <View className="mb-12 items-center">
        <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-primary">
          <Ionicons name="key" size={48} color="#333333" />
        </View>
        <Text className="mb-2 text-header font-bold text-text">パスもん</Text>
        <Text className="text-center text-body text-subtext">
          かんたん・あんしん{"\n"}パスワード管理
        </Text>
      </View>

      {error ? (
        <View className="mb-4 w-full rounded-button bg-danger/10 p-4">
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
