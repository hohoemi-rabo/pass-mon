import { View } from "react-native";
import type { ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={`rounded-card bg-card p-4 shadow-sm ${className ?? ""}`}
      style={{
        boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.08)",
        elevation: 2,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
