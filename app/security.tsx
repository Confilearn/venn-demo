import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { Stack } from "expo-router";

export default function SecurityScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const securityFeatures = [
    {
      icon: "shield",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      status: "enabled",
    },
    {
      icon: "lock",
      title: "Face ID / Touch ID",
      description: "Use biometric authentication for quick access",
      status: "enabled",
    },
    {
      icon: "eye",
      title: "Privacy Settings",
      description: "Control how your data is shared and used",
      status: "configured",
    },
    {
      icon: "smartphone",
      title: "Device Management",
      description: "Manage trusted devices and sessions",
      status: "active",
    },
  ];

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="x" size={24} color={colors.text} />
          </Pressable>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Security
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Security Features
          </Text>

          {securityFeatures.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <View style={styles.featureHeader}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: colors.primaryMuted },
                  ]}
                >
                  <Feather
                    name={feature.icon as any}
                    size={20}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.featureInfo}>
                  <Text
                    style={[
                      styles.featureTitle,
                      { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                    ]}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={[
                      styles.featureDesc,
                      {
                        color: colors.textSecondary,
                        fontFamily: "DMSans_400Regular",
                      },
                    ]}
                  >
                    {feature.description}
                  </Text>
                </View>
                <View style={styles.featureStatus}>
                  <Text
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          feature.status === "enabled"
                            ? colors.success
                            : colors.card,
                        color:
                          feature.status === "enabled" ? "#fff" : colors.text,
                      },
                    ]}
                  >
                    {feature.status}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 17 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, marginBottom: 20 },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  featureInfo: {
    flex: 1,
    marginLeft: 12,
  },
  featureTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  featureStatus: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 60,
    alignItems: "center",
  },
  statusBadge: {
    fontSize: 11,
    fontFamily: "DMSans_600SemiBold",
    textTransform: "uppercase",
  },
});
