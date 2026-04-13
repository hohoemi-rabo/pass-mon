import { Pressable, Text, View } from "react-native";
import { Colors, Overlays } from "@/constants/theme";

interface SegmentControlProps {
  segments: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

export function SegmentControl({
  segments,
  activeIndex,
  onChange,
}: SegmentControlProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Colors.card,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Overlays.cardBorder,
        padding: 4,
      }}
    >
      {segments.map((label, index) => {
        const isActive = index === activeIndex;
        return (
          <Pressable
            key={label}
            onPress={() => onChange(index)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            style={{
              flex: 1,
              minHeight: 44,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              backgroundColor: isActive ? Colors.primary : "transparent",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: isActive ? "#1A1A2E" : Colors.subtext,
              }}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
