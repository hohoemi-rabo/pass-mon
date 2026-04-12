import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors, FontFamily } from "@/constants/theme";

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

export function Header({ title, onBack }: HeaderProps) {
  return (
    <View className="flex-row items-center bg-background px-4 pb-2 pt-4">
      {onBack ? (
        <Pressable
          onPress={onBack}
          className="mr-2 h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="戻る"
        >
          <Ionicons name="chevron-back" size={28} color={Colors.text} />
        </Pressable>
      ) : null}
      <Text
        className="flex-1 text-header font-semibold"
        style={{ color: Colors.text, letterSpacing: 0.5, fontFamily: FontFamily.bold }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}
