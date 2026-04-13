import { useState } from "react";
import { Pressable, Text, TextInput as RNTextInput, View } from "react-native";
import type { TextInputProps as RNTextInputProps } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/theme";

interface TextInputProps extends RNTextInputProps {
  label: string;
}

export function TextInput({ label, style, secureTextEntry, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  return (
    <View className="gap-2">
      <Text className="text-body font-semibold text-text">{label}</Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.card,
          borderColor: isFocused ? Colors.inputFocus : Colors.inputBorder,
          borderWidth: isFocused ? 2 : 1,
          borderRadius: 12,
        }}
      >
        <RNTextInput
          className="h-[52px] flex-1 px-4 text-body text-text"
          placeholderTextColor={Colors.placeholder}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          style={style}
          {...props}
        />
        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsSecureVisible((prev) => !prev)}
            className="h-12 w-12 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={isSecureVisible ? "パスワードを隠す" : "パスワードを表示"}
          >
            <Ionicons
              name={isSecureVisible ? "eye-off" : "eye"}
              size={22}
              color={Colors.subtext}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
