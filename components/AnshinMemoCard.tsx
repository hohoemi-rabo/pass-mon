import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card } from "@/components/Card";
import { Colors } from "@/constants/theme";

interface AnshinMemoCardProps {
  title: string;
  onPress: () => void;
  drag?: () => void;
  isActive?: boolean;
}

export function AnshinMemoCard({
  title,
  onPress,
  drag,
  isActive,
}: AnshinMemoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={drag}
      disabled={isActive}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={{ opacity: isActive ? 0.9 : 1 }}
    >
      <Card
        style={
          isActive
            ? {
                borderWidth: 1,
                borderColor: Colors.inputBorder,
                backgroundColor: Colors.cardElevated,
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.5)",
                elevation: 8,
              }
            : undefined
        }
      >
        <View className="flex-row items-center">
          {drag ? (
            <View className="mr-3 items-center justify-center">
              <Ionicons
                name="reorder-three"
                size={24}
                color={Colors.subtext}
              />
            </View>
          ) : null}
          <Ionicons
            name="heart"
            size={20}
            color={Colors.secondary}
            style={{ marginRight: 12 }}
          />
          <View className="flex-1">
            <Text
              className="text-text"
              style={{ fontSize: 18, fontWeight: "700" }}
            >
              {title}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={24}
            color={Colors.primary}
          />
        </View>
      </Card>
    </Pressable>
  );
}
