/**
 * パスもん デザインシステム定数
 *
 * シニア向けUI制約:
 * - フォント最小18px、見出し22px以上
 * - タップ領域最小48x48dp
 * - WCAG AA準拠コントラスト比
 *
 * デザインコンセプト: ダークネイビー × ウォームゴールド
 * 上品で落ち着いた、スタイリッシュなデザイン
 */

export const Colors = {
  primary: "#D4A056",
  primaryDark: "#B8893E",
  secondary: "#5BBFB8",
  secondaryDark: "#4AA9A2",
  background: "#091b36",
  card: "#0d2847",
  cardElevated: "#112f52",
  text: "#FFFFFF",
  subtext: "#8BA3C4",
  danger: "#FF6B6B",
  dangerDark: "#E85C5C",
  success: "#51CF66",
  border: "#1A3556",
  inputBorder: "#2A4A6E",
  inputFocus: "#D4A056",
  tabBar: "#061527",
} as const;

export const Overlays = {
  primaryLight: "rgba(212,160,86,0.15)",
  primaryBorder: "rgba(212,160,86,0.3)",
  dangerLight: "rgba(255,107,107,0.12)",
  dangerBorder: "rgba(255,107,107,0.25)",
  secondaryLight: "rgba(91,191,184,0.12)",
  secondaryBorder: "rgba(91,191,184,0.25)",
  cardBorder: "rgba(255,255,255,0.06)",
  pressedLight: "rgba(255,255,255,0.08)",
} as const;

export const FontFamily = {
  regular: "MPlusRounded",
  medium: "MPlusRounded-Medium",
  bold: "MPlusRounded-Bold",
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
