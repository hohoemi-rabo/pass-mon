import { View } from "react-native";
import type { ViewProps } from "react-native";
import { Overlays } from "@/constants/theme";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, style, ...props }: CardProps) {
  return (
    <View
      className={`rounded-card bg-card p-4 ${className ?? ""}`}
      style={[
        {
          borderWidth: 1,
          borderColor: Overlays.cardBorder,
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
