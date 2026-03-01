import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
  Pressable,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { Stack } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function NotificationsScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const [notifications, setNotifications] = useState({
    transactions: true,
    deposits: true,
    securityAlerts: true,
    marketing: false,
    accountUpdates: true,
  });

  const notificationTypes = [
    {
      id: "transactions" as const,
      title: "Transaction Notifications",
      description: "Get notified about all account transactions and payments",
      icon: "credit-card",
      color: "#4C7CFF",
      gradient: ["#667EEA", "#764BA2"] as const,
    },
    {
      id: "deposits" as const,
      title: "Deposit Alerts",
      description: "Receive notifications when money is added to your account",
      icon: "arrow-down-left",
      color: "#00D09C",
      gradient: ["#00D09C", "#00A878"] as const,
    },
    {
      id: "securityAlerts" as const,
      title: "Security Alerts",
      description:
        "Important notifications about account security and login attempts",
      icon: "shield",
      color: "#FF6B8A",
      gradient: ["#FF6B8A", "#FE5196"] as const,
    },
    {
      id: "marketing" as const,
      title: "Marketing Communications",
      description: "Updates about new features and promotional offers",
      icon: "mail",
      color: "#FFB347",
      gradient: ["#FFB347", "#FF8C42"] as const,
    },
    {
      id: "accountUpdates" as const,
      title: "Account Updates",
      description: "Important information about your account and services",
      icon: "info",
      color: "#9B59B6",
      gradient: ["#9B59B6", "#8E44AD"] as const,
    },
  ];

  const animatedValues = useState(
    notificationTypes.reduce(
      (acc, type) => {
        acc[type.id] = new Animated.Value(notifications[type.id] ? 1 : 0);
        return acc;
      },
      {} as Record<(typeof notificationTypes)[number]["id"], Animated.Value>,
    ),
  )[0];

  const handleToggle = (type: (typeof notificationTypes)[number]["id"]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newValue = !notifications[type];

    // Animate the toggle
    Animated.timing(animatedValues[type], {
      toValue: newValue ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setNotifications((prev) => ({
      ...prev,
      [type]: newValue,
    }));
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
              Notifications
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
              Manage your preferences
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          {/* Quick Actions Section */}
          <View style={styles.quickActionsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsContainer}>
              <Pressable
                style={styles.quickActionButton}
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success,
                  );
                  const allEnabled = Object.keys(notifications).reduce(
                    (acc, key) => {
                      acc[key as keyof typeof notifications] = true;
                      return acc;
                    },
                    {} as typeof notifications,
                  );
                  setNotifications(allEnabled);
                  // Animate all toggles
                  Object.keys(animatedValues).forEach((key) => {
                    Animated.timing(
                      animatedValues[key as keyof typeof animatedValues],
                      {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: false,
                      },
                    ).start();
                  });
                }}
              >
                <LinearGradient
                  colors={["#4C7CFF", "#667EEA"]}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Feather name="check-circle" size={20} color="#fff" />
                  <Text style={styles.quickActionText}>Enable All</Text>
                </LinearGradient>
              </Pressable>
              <Pressable
                style={styles.quickActionButton}
                onPress={() => {
                  Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Warning,
                  );
                  const allDisabled = Object.keys(notifications).reduce(
                    (acc, key) => {
                      acc[key as keyof typeof notifications] = false;
                      return acc;
                    },
                    {} as typeof notifications,
                  );
                  setNotifications(allDisabled);
                  // Animate all toggles
                  Object.keys(animatedValues).forEach((key) => {
                    Animated.timing(
                      animatedValues[key as keyof typeof animatedValues],
                      {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: false,
                      },
                    ).start();
                  });
                }}
              >
                <LinearGradient
                  colors={["#FF6B8A", "#FE5196"]}
                  style={styles.quickActionGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Feather name="x-circle" size={20} color="#fff" />
                  <Text style={styles.quickActionText}>Disable All</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Notification Preferences */}
          <View style={styles.preferencesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Notification Preferences
            </Text>

            {notificationTypes.map((type, index) => (
              <Animated.View
                key={type.id}
                style={[
                  styles.notificationCard,
                  {
                    backgroundColor: colors.card,
                    transform: [
                      {
                        translateY: animatedValues[type.id].interpolate({
                          inputRange: [0, 1],
                          outputRange: [10, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.notificationContent}>
                  <View style={styles.notificationLeft}>
                    <LinearGradient
                      colors={type.gradient as readonly [string, string]}
                      style={styles.notificationIcon}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Feather name={type.icon as any} size={20} color="#fff" />
                    </LinearGradient>
                    <View style={styles.notificationInfo}>
                      <Text
                        style={[
                          styles.notificationTitle,
                          {
                            color: colors.text,
                            fontFamily: "DMSans_600SemiBold",
                          },
                        ]}
                      >
                        {type.title}
                      </Text>
                      <Text
                        style={[
                          styles.notificationDesc,
                          {
                            color: colors.textSecondary,
                            fontFamily: "DMSans_400Regular",
                          },
                        ]}
                      >
                        {type.description}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.toggleContainer}>
                    <Switch
                      value={
                        notifications[type.id as keyof typeof notifications]
                      }
                      onValueChange={() => handleToggle(type.id)}
                      trackColor={{ false: colors.border, true: type.color }}
                      thumbColor="#fff"
                      ios_backgroundColor={colors.border}
                    />
                  </View>
                </View>
              </Animated.View>
            ))}
          </View>

          {/* Footer Info */}
          <View style={styles.footerSection}>
            <View
              style={[styles.infoCard, { backgroundColor: colors.surface }]}
            >
              <Feather name="info" size={20} color={colors.primary} />
              <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                You can change these settings at any time. Some notifications
                may be required for security purposes.
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
  quickActionsSection: {
    marginBottom: 32,
  },
  preferencesSection: {
    marginBottom: 32,
  },
  footerSection: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 16,
  },

  // Quick Actions
  quickActionsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  quickActionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  quickActionText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: "DMSans_600SemiBold",
  },

  // Enhanced Notification Cards
  notificationCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  notificationContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notificationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  notificationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 22,
  },
  notificationDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  toggleContainer: {
    marginLeft: 12,
  },

  // Footer
  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
});
