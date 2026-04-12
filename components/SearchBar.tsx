import { Pressable, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/theme";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "サービス名で検索",
}: SearchBarProps) {
  return (
    <View
      className="flex-row items-center rounded-button px-3"
      style={{
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.border,
      }}
    >
      <Ionicons name="search" size={22} color={Colors.subtext} />
      <TextInput
        className="ml-2 h-[48px] flex-1 text-body text-text"
        placeholder={placeholder}
        placeholderTextColor={Colors.subtext}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText("")}
          className="h-10 w-10 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="検索をクリア"
        >
          <Ionicons name="close-circle" size={20} color={Colors.subtext} />
        </Pressable>
      ) : null}
    </View>
  );
}
