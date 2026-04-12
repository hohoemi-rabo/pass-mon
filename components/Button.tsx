import { Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";
import { Colors } from "@/constants/theme";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends Omit<PressableProps, "children"> {
  title: string;
  variant?: ButtonVariant;
}

const variantColors: Record<
  ButtonVariant,
  { base: string; pressed: string }
> = {
  primary: { base: Colors.primary, pressed: Colors.primaryDark },
  secondary: { base: Colors.secondary, pressed: Colors.secondaryDark },
  danger: { base: Colors.danger, pressed: Colors.dangerDark },
};

export function Button({
  title,
  variant = "primary",
  disabled,
  ...props
}: ButtonProps) {
  const colors = variantColors[variant];

  return (
    <Pressable
      className="min-h-[52px] items-center justify-center rounded-button px-6"
      style={({ pressed }) => ({
        backgroundColor: disabled
          ? Colors.inputBorder
          : pressed
            ? colors.pressed
            : colors.base,
        opacity: disabled ? 0.6 : 1,
      })}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      {...props}
    >
      <Text
        className={`text-subtitle font-bold ${disabled ? "text-subtext" : "text-text"}`}
      >
        {title}
      </Text>
    </Pressable>
  );
}
