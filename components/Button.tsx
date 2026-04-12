import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { PressableProps } from "react-native";
import { Colors, FontFamily, Overlays } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
}

function getButtonStyles(
  variant: ButtonVariant,
  disabled: boolean,
  pressed: boolean,
) {
  if (disabled) {
    return {
      container: {
        backgroundColor: Colors.border,
        opacity: 0.5,
      },
      text: { color: Colors.subtext },
    };
  }

  switch (variant) {
    case "primary":
      return {
        container: {
          backgroundColor: pressed ? Colors.primaryDark : Colors.primary,
        },
        text: { color: "#1A1A2E" },
      };
    case "secondary":
      return {
        container: {
          backgroundColor: pressed ? Overlays.pressedLight : "transparent",
          borderWidth: 1.5,
          borderColor: Colors.primary,
        },
        text: { color: Colors.primary },
      };
    case "danger":
      return {
        container: {
          backgroundColor: pressed
            ? Colors.dangerDark
            : Overlays.dangerLight,
          borderWidth: 1.5,
          borderColor: Colors.danger,
        },
        text: { color: Colors.danger },
      };
  }
}

export function Button({
  title,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const styles = getButtonStyles(variant, !!disabled, pressed);

  return (
    <Pressable
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...props}
    >
      <View
        style={[
          {
            minHeight: 52,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            paddingHorizontal: 24,
          },
          styles.container,
        ]}
      >
        <Text
          style={[
            { fontSize: 20, lineHeight: 30, fontFamily: FontFamily.medium },
            styles.text,
          ]}
        >
          {title}
        </Text>
      </View>
    </Pressable>
  );
}
