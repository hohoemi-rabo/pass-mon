import { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Clipboard from "expo-clipboard";
import { Colors } from "@/constants/theme";

interface PasswordFieldProps {
  label: string;
  value: string | null;
}

export function PasswordField({ label, value }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCopy = async () => {
    if (!value) return;
    await Clipboard.setStringAsync(value);
    setIsCopied(true);
  };

  const hasValue = value != null && value.length > 0;

  return (
    <View className="gap-1">
      <Text className="text-body font-semibold text-text">{label}</Text>
      <View className="flex-row items-center gap-2">
        <Text
          className="flex-1 text-body"
          style={{ color: hasValue ? Colors.text : Colors.subtext }}
        >
          {hasValue ? (isVisible ? value : "●●●●●●●●") : "未登録"}
        </Text>
        {hasValue ? (
          <View className="flex-row gap-1">
            <Pressable
              onPress={() => setIsVisible((prev) => !prev)}
              className="h-12 w-12 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel={isVisible ? "非表示にする" : "表示する"}
            >
              <Ionicons
                name={isVisible ? "eye-off" : "eye"}
                size={24}
                color={Colors.subtext}
              />
            </Pressable>
            <Pressable
              onPress={handleCopy}
              className="h-12 w-12 items-center justify-center"
              accessibilityRole="button"
              accessibilityLabel="コピー"
            >
              <Ionicons
                name={isCopied ? "checkmark" : "copy-outline"}
                size={24}
                color={isCopied ? Colors.success : Colors.subtext}
              />
            </Pressable>
          </View>
        ) : null}
      </View>
      {isCopied ? (
        <Text className="text-sm" style={{ color: Colors.success }}>
          コピーしました
        </Text>
      ) : null}
    </View>
  );
}
