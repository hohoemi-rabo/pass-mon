/**
 * パスもん デザインシステム定数
 *
 * シニア向けUI制約:
 * - フォント最小18px、見出し22px以上
 * - タップ領域最小48x48dp
 * - WCAG AA準拠コントラスト比
 */

export const Colors = {
  primary: "#FF8C42",
  primaryDark: "#E67A30",
  secondary: "#4ECDC4",
  secondaryDark: "#3DBDB4",
  background: "#FFF8F0",
  card: "#FFFFFF",
  text: "#333333",
  subtext: "#888888",
  danger: "#FF6B6B",
  dangerDark: "#E85C5C",
  success: "#51CF66",
  border: "#E5E5E5",
  inputBorder: "#CCCCCC",
  inputFocus: "#FF8C42",
} as const;

export const FontSizes = {
  body: 18,
  subtitle: 20,
  title: 24,
  header: 28,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const BorderRadius = {
  button: 12,
  card: 16,
  input: 12,
} as const;

export const MinTapSize = 48;
