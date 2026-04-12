import { View } from "react-native";
import type { ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={`rounded-card bg-card p-4 ${className ?? ""}`}
      style={{
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.3)",
        elevation: 3,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
