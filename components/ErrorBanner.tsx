import { Text, View } from "react-native";
import { Overlays } from "@/constants/theme";

interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <View
      style={{
        backgroundColor: Overlays.dangerLight,
        borderWidth: 1,
        borderColor: Overlays.dangerBorder,
        borderRadius: 12,
        padding: 16,
      }}
    >
      <Text className="text-center text-body text-danger">{message}</Text>
    </View>
  );
}
