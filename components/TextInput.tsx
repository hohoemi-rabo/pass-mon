import { useState } from "react";
import { Text, TextInput as RNTextInput, View } from "react-native";
import type { TextInputProps as RNTextInputProps } from "react-native";
import { Colors } from "@/constants/theme";

interface TextInputProps extends RNTextInputProps {
  label: string;
}

export function TextInput({ label, style, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="gap-2">
      <Text className="text-body font-semibold text-text">{label}</Text>
      <RNTextInput
        className="h-[52px] rounded-button border px-4 text-body text-text"
        style={[
          {
            borderColor: isFocused ? Colors.inputFocus : Colors.inputBorder,
            borderWidth: isFocused ? 2 : 1,
          },
          style,
        ]}
        placeholderTextColor={Colors.subtext}
        onFocus={(e) => {
          setIsFocused(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          props.onBlur?.(e);
        }}
        {...props}
      />
    </View>
  );
}
