import { Text, View } from "react-native";
import { Colors, FontFamily } from "@/constants/theme";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <View className="bg-background px-4 pb-2 pt-4">
      <Text
        className="text-header font-semibold"
        style={{ color: Colors.text, letterSpacing: 0.5, fontFamily: FontFamily.bold }}
      >
        {title}
      </Text>
    </View>
  );
}
