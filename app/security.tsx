import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Pressable,
  Animated,
  Switch,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function SecurityScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    biometric: true,
    privacyLock: false,
    deviceManagement: true,
  });

  const securityFeatures = [
    {
      id: "twoFactor" as const,
      icon: "shield",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      status: "enabled",
      color: "#00D09C",
      gradient: ["#00D09C", "#00A878"] as const,
      priority: "high",
    },
    {
      id: "biometric" as const,
      icon: "lock",
      title: "Face ID / Touch ID",
      description: "Use biometric authentication for quick access",
      status: "enabled",
      color: "#4C7CFF",
      gradient: ["#4C7CFF", "#667EEA"] as const,
      priority: "high",
    },
    {
      id: "privacyLock" as const,
      icon: "eye",
      title: "Privacy Settings",
      description: "Control how your data is shared and used",
      status: "configured",
      color: "#9B59B6",
      gradient: ["#9B59B6", "#8E44AD"] as const,
      priority: "medium",
    },
    {
      id: "deviceManagement" as const,
      icon: "smartphone",
      title: "Device Management",
      description: "Manage trusted devices and sessions",
      status: "active",
      color: "#FFB347",
      gradient: ["#FFB347", "#FF8C42"] as const,
      priority: "medium",
    },
  ];

  const animatedValues = useState(
    securityFeatures.reduce(
      (acc, feature) => {
        acc[feature.id] = new Animated.Value(
          securitySettings[feature.id as keyof typeof securitySettings] ? 1 : 0,
        );
        return acc;
      },
      {} as Record<string, Animated.Value>,
    ),
  )[0];

  const handleToggle = (featureId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue =
      !securitySettings[featureId as keyof typeof securitySettings];

    // Animate the toggle
    Animated.timing(animatedValues[featureId], {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setSecuritySettings((prev) => ({
      ...prev,
      [featureId]: newValue,
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "enabled":
        return "#00D09C";
      case "active":
        return "#4C7CFF";
      case "configured":
        return "#FFB347";
      default:
        return colors.textSecondary;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return "alert-triangle";
      case "medium":
        return "info";
      default:
        return "check-circle";
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        {/* Enhanced Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={styles.backButton}
          >
            <Feather name="x" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.headerContent}>
            <Text
              style={[
                styles.headerTitle,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Security
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Protect your account
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Security Score */}
          <View style={styles.scoreSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Security Score
            </Text>
            <View style={[styles.scoreCard, { backgroundColor: colors.card }]}>
              <LinearGradient
                colors={["#00D09C", "#00A878"]}
                style={styles.scoreGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Feather name="shield" size={24} color="#fff" />
                <Text style={styles.scoreNumber}>85%</Text>
                <Text style={styles.scoreLabel}>Strong</Text>
              </LinearGradient>
              <View style={styles.scoreDetails}>
                <Text style={[styles.scoreText, { color: colors.text }]}>
                  Your account is well protected
                </Text>
                <Text
                  style={[styles.scoreSubtext, { color: colors.textSecondary }]}
                >
                  3 of 4 security features enabled
                </Text>
              </View>
            </View>
          </View>

          {/* Security Features */}
          <View style={styles.featuresSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Security Features
            </Text>

            {securityFeatures.map((feature, index) => (
              <Animated.View
                key={feature.id}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: colors.card,
                    transform: [
                      {
                        translateY: animatedValues[feature.id].interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.featureContent}>
                  <View style={styles.featureLeft}>
                    <LinearGradient
                      colors={feature.gradient as readonly [string, string]}
                      style={styles.featureIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Feather
                        name={feature.icon as any}
                        size={22}
                        color="#fff"
                      />
                    </LinearGradient>
                    <View style={styles.featureInfo}>
                      <View style={styles.featureHeader}>
                        <Text
                          style={[
                            styles.featureTitle,
                            {
                              color: colors.text,
                              fontFamily: "DMSans_600SemiBold",
                            },
                          ]}
                        >
                          {feature.title}
                        </Text>
                        <View style={styles.priorityBadge}>
                          <Feather
                            name={getPriorityIcon(feature.priority) as any}
                            size={12}
                            color={
                              feature.priority === "high"
                                ? "#FF6B8A"
                                : "#FFB347"
                            }
                          />
                        </View>
                      </View>
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
                  </View>
                  <View style={styles.featureRight}>
                    <View style={styles.statusContainer}>
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(feature.status) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: getStatusColor(feature.status),
                            fontFamily: "DMSans_600SemiBold",
                          },
                        ]}
                      >
                        {feature.status}
                      </Text>
                    </View>
                    <Switch
                      value={
                        securitySettings[
                          feature.id as keyof typeof securitySettings
                        ]
                      }
                      onValueChange={() => handleToggle(feature.id)}
                      trackColor={{ false: colors.border, true: feature.color }}
                      thumbColor="#fff"
                      ios_backgroundColor={colors.border}
                    />
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Security Tips */}
          <View style={styles.tipsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Security Tips
            </Text>
            <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
              <Feather name="info" size={20} color={colors.primary} />
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Enable all security features for maximum protection. Regular
                security updates help keep your account safe.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  // Enhanced Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },

  // Sections
  scoreSection: {
    marginBottom: 32,
  },
  featuresSection: {
    marginBottom: 32,
  },
  tipsSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 16,
  },

  // Security Score
  scoreCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  scoreGradient: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 20,
    color: "#fff",
    fontFamily: "DMSans_700Bold",
    marginTop: 4,
  },
  scoreLabel: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "DMSans_600SemiBold",
  },
  scoreDetails: {
    flex: 1,
  },
  scoreText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 4,
  },
  scoreSubtext: {
    fontSize: 14,
  },

  // Enhanced Feature Cards
  featureCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  featureContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  featureInfo: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  featureTitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  featureDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  priorityBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 107, 138, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  featureRight: {
    alignItems: "flex-end",
    gap: 12,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    textTransform: "uppercase",
  },

  // Tips
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
