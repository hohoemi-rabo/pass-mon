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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
      }}
      {...props}
    >
      {children}
    </View>
  );
}
