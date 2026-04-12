import { Alert, Platform } from "react-native";

/**
 * Show a confirmation dialog that works on both web and native.
 */
export function confirmDialog(
  title: string,
  message: string,
  onConfirm: () => void,
): void {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n${message}`)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(title, message, [
    { text: "キャンセル", style: "cancel" },
    { text: "OK", style: "destructive", onPress: onConfirm },
  ]);
}
