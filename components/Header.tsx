import { Text, View } from "react-native";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <View className="bg-background px-4 pb-2 pt-4">
      <Text className="text-header font-bold text-text">{title}</Text>
    </View>
  );
}
