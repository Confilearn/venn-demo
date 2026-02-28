import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Switch,
  Alert,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { useToast } from "@/lib/toast-context";

export default function PersonalInfoScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Confidence",
    lastName: "Ezeorah",
    email: "confidence@venn.ca",
    phone: "+1 (416) 555-0142",
    address: "123 Tech Street, Suite 100",
    city: "Toronto",
    state: "ON",
    zipCode: "M5V 3A1",
    country: "Canada",
    dateOfBirth: "1995-06-15",
    ssnLast4: "6789",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    biometricEnabled: false,
    loginAlerts: true,
  });

  const handleSave = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast("Personal information updated successfully", "success");
  };

  const handleToggleNotification = (key: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleSecurity = (key: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  const InfoCard = ({
    title,
    children,
    icon,
  }: {
    title: string;
    children: React.ReactNode;
    icon: string;
  }) => (
    <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
      <View style={styles.cardHeader}>
        <View
          style={[styles.cardIcon, { backgroundColor: colors.primaryMuted }]}
        >
          <Feather name={icon as any} size={20} color={colors.primary} />
        </View>
        <Text
          style={[
            styles.cardTitle,
            { color: colors.text, fontFamily: "DMSans_600SemiBold" },
          ]}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );

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
          Personal Information
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Section */}
        <InfoCard title="Profile Information" icon="user">
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={[styles.avatarText, { fontFamily: "DMSans_700Bold" }]}
                >
                  CE
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text
                  style={[
                    styles.profileName,
                    { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                  ]}
                >
                  Confidence Ezeorah
                </Text>
                <Text
                  style={[
                    styles.profileEmail,
                    {
                      color: colors.textSecondary,
                      fontFamily: "DMSans_400Regular",
                    },
                  ]}
                >
                  confidence@venn.ca
                </Text>
              </View>
            </View>
          </View>
        </InfoCard>

        {/* Contact Information */}
        <InfoCard title="Contact Information" icon="mail">
          <View style={styles.contactGrid}>
            <View style={styles.contactItem}>
              <Text
                style={[
                  styles.contactLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_500Medium",
                  },
                ]}
              >
                Email
              </Text>
              <Text
                style={[
                  styles.contactValue,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                {personalInfo.email}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Text
                style={[
                  styles.contactLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_500Medium",
                  },
                ]}
              >
                Phone
              </Text>
              <Text
                style={[
                  styles.contactValue,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                {personalInfo.phone}
              </Text>
            </View>
            <View style={styles.contactItem}>
              <Text
                style={[
                  styles.contactLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_500Medium",
                  },
                ]}
              >
                Address
              </Text>
              <Text
                style={[
                  styles.contactValue,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                {personalInfo.address}
              </Text>
            </View>
          </View>
        </InfoCard>

        {/* Security Settings */}
        <InfoCard title="Security Settings" icon="shield">
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Two-Factor Auth
              </Text>
              <Switch
                value={security.twoFactorEnabled}
                onValueChange={() =>
                  handleToggleSecurity(
                    "twoFactorEnabled",
                    !security.twoFactorEnabled,
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Biometric Login
              </Text>
              <Switch
                value={security.biometricEnabled}
                onValueChange={() =>
                  handleToggleSecurity(
                    "biometricEnabled",
                    !security.biometricEnabled,
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Login Alerts
              </Text>
              <Switch
                value={security.loginAlerts}
                onValueChange={() =>
                  handleToggleSecurity("loginAlerts", !security.loginAlerts)
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </InfoCard>

        {/* Notification Preferences */}
        <InfoCard title="Notification Preferences" icon="bell">
          <View style={styles.settingsGrid}>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Email Notifications
              </Text>
              <Switch
                value={notifications.emailNotifications}
                onValueChange={() =>
                  handleToggleNotification(
                    "emailNotifications",
                    !notifications.emailNotifications,
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                SMS Notifications
              </Text>
              <Switch
                value={notifications.smsNotifications}
                onValueChange={() =>
                  handleToggleNotification(
                    "smsNotifications",
                    !notifications.smsNotifications,
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Push Notifications
              </Text>
              <Switch
                value={notifications.pushNotifications}
                onValueChange={() =>
                  handleToggleNotification(
                    "pushNotifications",
                    !notifications.pushNotifications,
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.settingItem}>
              <Text
                style={[
                  styles.settingLabel,
                  { color: colors.text, fontFamily: "DMSans_500Medium" },
                ]}
              >
                Marketing Emails
              </Text>
              <Switch
                value={notifications.marketingEmails}
                onValueChange={() =>
                  handleToggleNotification(
                    "marketingEmails",
                    !notifications.marketingEmails,
                  )
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </InfoCard>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={handleSave}
          >
            <Text
              style={[
                styles.saveBtnText,
                { color: "#fff", fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Save Changes
            </Text>
          </Pressable>
        </View>
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
  infoCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "DMSans_700Bold",
  },
  profileInfo: {
    alignItems: "flex-start",
  },
  profileName: {
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "DMSans_400Regular",
    marginTop: 4,
  },
  contactGrid: {
    gap: 16,
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  contactLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    minWidth: 80,
  },
  contactValue: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    flex: 1,
    textAlign: "right",
  },
  settingsGrid: {
    gap: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 16,
    fontFamily: "DMSans_600SemiBold",
  },
});
