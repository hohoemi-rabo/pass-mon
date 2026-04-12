import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card } from "@/components/Card";
import { Colors } from "@/constants/theme";

interface CredentialCardProps {
  serviceName: string;
  accountId: string | null;
  onPress: () => void;
}

export function CredentialCard({
  serviceName,
  accountId,
  onPress,
}: CredentialCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={serviceName}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Card>
        <View className="flex-row items-center">
          <View className="flex-1 gap-1">
            <Text className="text-subtitle font-bold text-text">
              {serviceName}
            </Text>
            <Text className="text-body text-subtext">
              {accountId ?? "IDなし"}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={Colors.subtext}
          />
        </View>
      </Card>
    </Pressable>
  );
}
