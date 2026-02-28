import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Switch,
  Platform,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";

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
      id: "transactions",
      title: "Transaction Notifications",
      description: "Get notified about all account transactions and payments",
      icon: "credit-card",
    },
    {
      id: "deposits",
      title: "Deposit Alerts",
      description: "Receive notifications when money is added to your account",
      icon: "arrow-down-left",
    },
    {
      id: "securityAlerts",
      title: "Security Alerts",
      description:
        "Important notifications about account security and login attempts",
      icon: "shield",
    },
    {
      id: "marketing",
      title: "Marketing Communications",
      description: "Updates about new features and promotional offers",
      icon: "mail",
    },
    {
      id: "accountUpdates",
      title: "Account Updates",
      description: "Important information about your account and services",
      icon: "info",
    },
  ];

  const handleToggle = (type: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev],
    }));
  };

  return (
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
          Notifications
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
          Notification Preferences
        </Text>

        {notificationTypes.map((type) => (
          <View key={type.id} style={styles.notificationItem}>
            <View style={styles.notificationHeader}>
              <View
                style={[
                  styles.notificationIcon,
                  { backgroundColor: colors.primaryMuted },
                ]}
              >
                <Feather
                  name={type.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.notificationInfo}>
                <Text
                  style={[
                    styles.notificationTitle,
                    { color: colors.text, fontFamily: "DMSans_600SemiBold" },
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
            <View style={styles.notificationToggle}>
              <Switch
                value={notifications[type.id as keyof typeof notifications]}
                onValueChange={() => handleToggle(type.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
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
  notificationItem: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationInfo: {
    flex: 1,
    marginLeft: 12,
  },
  notificationTitle: {
    fontSize: 15,
    marginBottom: 4,
  },
  notificationDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  notificationToggle: {
    alignItems: "center",
  },
});
