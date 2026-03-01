import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useTheme } from "@/lib/theme-context";
import { useThemeColors } from "@/constants/colors";

export function AuthLoader() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.background,
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
