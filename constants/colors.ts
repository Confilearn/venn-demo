const Colors = {
  dark: {
    background: "#0A0E17",
    surface: "#141926",
    card: "#1C2333",
    cardElevated: "#242D40",
    primary: "#00D09C",
    primaryMuted: "rgba(0, 208, 156, 0.15)",
    accent: "#4C7CFF",
    accentMuted: "rgba(76, 124, 255, 0.15)",
    text: "#FFFFFF",
    textSecondary: "#8F95A5",
    textTertiary: "#5A6070",
    border: "#1E2738",
    borderLight: "rgba(255,255,255,0.06)",
    success: "#00D09C",
    warning: "#FFB020",
    warningMuted: "rgba(255, 176, 32, 0.15)",
    error: "#FF4757",
    errorMuted: "rgba(255, 71, 87, 0.15)",
    tint: "#00D09C",
    tabIconDefault: "#5A6070",
    tabIconSelected: "#00D09C",
    skeleton: "#1E2738",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
  light: {
    background: "#F5F7FA",
    surface: "#FFFFFF",
    card: "#FFFFFF",
    cardElevated: "#F8F9FA",
    primary: "#00B386",
    primaryMuted: "rgba(0, 179, 134, 0.1)",
    accent: "#3366FF",
    accentMuted: "rgba(51, 102, 255, 0.1)",
    text: "#1A1D26",
    textSecondary: "#6B7280",
    textTertiary: "#9CA3AF",
    border: "#E5E7EB",
    borderLight: "rgba(0,0,0,0.04)",
    success: "#00B386",
    warning: "#F59E0B",
    warningMuted: "rgba(245, 158, 11, 0.1)",
    error: "#EF4444",
    errorMuted: "rgba(239, 68, 68, 0.1)",
    tint: "#00B386",
    tabIconDefault: "#9CA3AF",
    tabIconSelected: "#00B386",
    skeleton: "#E5E7EB",
    overlay: "rgba(0, 0, 0, 0.4)",
  },
};

export default Colors;

export type ThemeColors = typeof Colors.dark;

export function useThemeColors(
  scheme: "light" | "dark" | null | undefined,
): ThemeColors {
  if (!scheme) return Colors.dark; // Default to dark theme if no scheme
  return scheme === "light" ? Colors.light : Colors.dark;
}

export function getThemeColors(scheme: "light" | "dark"): ThemeColors {
  return scheme === "light" ? Colors.light : Colors.dark;
}
