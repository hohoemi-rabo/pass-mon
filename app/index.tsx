import { ScrollView, View } from "react-native";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import { TextInput } from "@/components/TextInput";

export default function Index() {
  return (
    <View className="flex-1 bg-background">
      <Header title="パスもん" />
      <ScrollView className="flex-1 px-4" contentContainerClassName="gap-4 pb-8">
        <Card>
          <TextInput label="サービス名" placeholder="例: Gmail" />
        </Card>

        <Card>
          <TextInput label="アカウントID" placeholder="例: taro@gmail.com" />
        </Card>

        <View className="gap-3 pt-2">
          <Button title="保存する" variant="primary" />
          <Button title="キャンセル" variant="secondary" />
          <Button title="削除する" variant="danger" />
          <Button title="無効ボタン" disabled />
        </View>
      </ScrollView>
    </View>
  );
}
