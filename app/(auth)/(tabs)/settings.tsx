import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAuth } from "@/hooks/useAuth";
import { confirmDialog } from "@/lib/platform";
import { Colors } from "@/constants/theme";

const APP_VERSION = Constants.expoConfig?.version ?? "1.0.0";

export default function Settings() {
  const { user, signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSignOut = () => {
    confirmDialog("ログアウト", "ログアウトしますか？", signOut);
  };

  return (
    <View
      className="flex-1 bg-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Header title="設定" />
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="mt-4 gap-4">
          <Card>
            <View className="gap-2">
              <Text className="text-subtitle font-semibold text-text">
                アカウント
              </Text>
              <View className="gap-1">
                <Text className="text-body text-subtext">メールアドレス</Text>
                <Text className="text-body text-text">
                  {user?.email ?? "不明"}
                </Text>
              </View>
            </View>
          </Card>

          <Card>
            <View className="gap-2">
              <Text className="text-subtitle font-semibold text-text">
                アプリ情報
              </Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-body text-subtext">バージョン</Text>
                <Text className="text-body text-text">{APP_VERSION}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-body text-subtext">アプリ名</Text>
                <Text className="text-body text-text">パスもん</Text>
              </View>
            </View>
          </Card>

          <View
            className="my-2 h-px"
            style={{ backgroundColor: Colors.border }}
          />

          <Button
            title="ログアウト"
            variant="danger"
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </View>
  );
}
