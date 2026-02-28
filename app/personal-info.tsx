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
  TextInput,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { useToast } from "@/lib/toast-context";
import { Stack } from "expo-router";

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

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");
  const [tempPersonalInfo, setTempPersonalInfo] = useState(personalInfo);
  const [hasChanges, setHasChanges] = useState(false);

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
    if (hasChanges) {
      setPersonalInfo(tempPersonalInfo);
      setHasChanges(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast("Personal information updated successfully", "success");
    }
  };

  const handleEditField = (field: string, currentValue: string) => {
    setEditField(field);
    setEditValue(currentValue);
    setEditModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      setTempPersonalInfo((prev) => ({ ...prev, [editField]: editValue }));
      setHasChanges(true);
      setEditModalVisible(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showToast(
        `${editField.replace(/([A-Z])/g, " $1").trim()} updated`,
        "success",
      );
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditField("");
    setEditValue("");
  };

  const handleDiscardChanges = () => {
    setTempPersonalInfo(personalInfo);
    setHasChanges(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    showToast("Changes discarded", "info");
  };

  const handleToggleNotification = (key: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleSecurity = (key: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  const EditableField = ({
    label,
    value,
    field,
    icon,
  }: {
    label: string;
    value: string;
    field: string;
    icon: string;
  }) => (
    <Pressable
      style={styles.editableField}
      onPress={() => handleEditField(field, value)}
    >
      <View style={styles.fieldLeft}>
        <View
          style={[styles.fieldIcon, { backgroundColor: colors.primaryMuted }]}
        >
          <Feather name={icon as any} size={16} color={colors.primary} />
        </View>
        <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>
          {label}
        </Text>
      </View>
      <View style={styles.fieldRight}>
        <Text style={[styles.fieldValue, { color: colors.text }]}>
          {tempPersonalInfo[field as keyof typeof tempPersonalInfo]}
        </Text>
        <Feather name="edit-2" size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
          <Pressable
            onPress={() => {
              if (hasChanges) {
                Alert.alert(
                  "Unsaved Changes",
                  "You have unsaved changes. Are you sure you want to leave?",
                  [
                    { text: "Stay", style: "cancel" },
                    {
                      text: "Discard",
                      style: "destructive",
                      onPress: () => router.back(),
                    },
                  ],
                );
              } else {
                router.back();
              }
            }}
            hitSlop={12}
          >
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
          {/* Profile Header */}
          <View
            style={[styles.profileHeader, { backgroundColor: colors.card }]}
          >
            <View style={styles.avatarSection}>
              <View
                style={[styles.avatar, { backgroundColor: colors.primary }]}
              >
                <Text
                  style={[styles.avatarText, { fontFamily: "DMSans_700Bold" }]}
                >
                  {tempPersonalInfo.firstName[0]}
                  {tempPersonalInfo.lastName[0]}
                </Text>
              </View>
              <View style={styles.profileInfo}>
                <Text
                  style={[
                    styles.profileName,
                    { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                  ]}
                >
                  {tempPersonalInfo.firstName} {tempPersonalInfo.lastName}
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
                  {tempPersonalInfo.email}
                </Text>
              </View>
            </View>
            {hasChanges && (
              <View style={styles.changesIndicator}>
                <Feather name="alert-circle" size={16} color={colors.warning} />
                <Text style={[styles.changesText, { color: colors.warning }]}>
                  Unsaved changes
                </Text>
              </View>
            )}
          </View>

          {/* Personal Information Section */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Personal Information
            </Text>
            <View style={styles.fieldsContainer}>
              <EditableField
                label="First Name"
                value={tempPersonalInfo.firstName}
                field="firstName"
                icon="user"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="Last Name"
                value={tempPersonalInfo.lastName}
                field="lastName"
                icon="user"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="Date of Birth"
                value={tempPersonalInfo.dateOfBirth}
                field="dateOfBirth"
                icon="calendar"
              />
            </View>
          </View>

          {/* Contact Information Section */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Contact Information
            </Text>
            <View style={styles.fieldsContainer}>
              <EditableField
                label="Email Address"
                value={tempPersonalInfo.email}
                field="email"
                icon="mail"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="Phone Number"
                value={tempPersonalInfo.phone}
                field="phone"
                icon="phone"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="Address"
                value={tempPersonalInfo.address}
                field="address"
                icon="home"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="City"
                value={tempPersonalInfo.city}
                field="city"
                icon="map-pin"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="State/Province"
                value={tempPersonalInfo.state}
                field="state"
                icon="map"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="ZIP/Postal Code"
                value={tempPersonalInfo.zipCode}
                field="zipCode"
                icon="package"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <EditableField
                label="Country"
                value={tempPersonalInfo.country}
                field="country"
                icon="globe"
              />
            </View>
          </View>

          {/* Security Settings */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Security Settings
            </Text>
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="shield" size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Two-Factor Authentication
                  </Text>
                </View>
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
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="user" size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Biometric Login
                  </Text>
                </View>
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
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="bell" size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Login Alerts
                  </Text>
                </View>
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
          </View>

          {/* Notification Preferences */}
          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Notification Preferences
            </Text>
            <View style={styles.settingsContainer}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="mail" size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Email Notifications
                  </Text>
                </View>
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
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather
                    name="message-square"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    SMS Notifications
                  </Text>
                </View>
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
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="smartphone" size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Push Notifications
                  </Text>
                </View>
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
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <Feather name="tag" size={20} color={colors.primary} />
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    Marketing Emails
                  </Text>
                </View>
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
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {hasChanges && (
              <Pressable
                style={({ pressed }) => [
                  styles.discardBtn,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    opacity: pressed ? 0.9 : 1,
                  },
                ]}
                onPress={handleDiscardChanges}
              >
                <Text
                  style={[
                    styles.discardBtnText,
                    {
                      color: colors.textSecondary,
                      fontFamily: "DMSans_600SemiBold",
                    },
                  ]}
                >
                  Discard Changes
                </Text>
              </Pressable>
            )}
            <Pressable
              style={({ pressed }) => [
                styles.saveBtn,
                {
                  backgroundColor: hasChanges ? colors.primary : colors.surface,
                  borderColor: hasChanges ? colors.primary : colors.border,
                  borderWidth: 1,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              onPress={handleSave}
              disabled={!hasChanges}
            >
              <Text
                style={[
                  styles.saveBtnText,
                  {
                    color: hasChanges ? "#fff" : colors.textTertiary,
                    fontFamily: "DMSans_600SemiBold",
                  },
                ]}
              >
                {hasChanges ? "Save Changes" : "No Changes"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>

        {/* Edit Modal */}
        <Modal
          visible={editModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleCancelEdit}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[styles.modalContent, { backgroundColor: colors.card }]}
            >
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Edit {editField.replace(/([A-Z])/g, " $1").trim()}
                </Text>
                <Pressable onPress={handleCancelEdit} hitSlop={12}>
                  <Feather name="x" size={24} color={colors.textSecondary} />
                </Pressable>
              </View>
              <TextInput
                style={[
                  styles.modalInput,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                value={editValue}
                onChangeText={setEditValue}
                placeholder={`Enter ${editField
                  .replace(/([A-Z])/g, " $1")
                  .trim()
                  .toLowerCase()}`}
                placeholderTextColor={colors.textTertiary}
                autoFocus
                multiline={editField === "address"}
              />
              <View style={styles.modalButtons}>
                <Pressable
                  style={[
                    styles.modalCancelBtn,
                    { backgroundColor: colors.surface },
                  ]}
                  onPress={handleCancelEdit}
                >
                  <Text
                    style={[
                      styles.modalCancelBtnText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  style={[
                    styles.modalSaveBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveEdit}
                >
                  <Text style={[styles.modalSaveBtnText, { color: "#fff" }]}>
                    Save
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
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

  // Profile Header
  profileHeader: {
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  changesIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(255, 176, 32, 0.1)",
  },
  changesText: {
    fontSize: 12,
    fontFamily: "DMSans_500Medium",
  },

  // Sections
  section: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
    marginBottom: 16,
  },
  fieldsContainer: {
    gap: 2,
  },

  // Editable Fields
  editableField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  fieldLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fieldIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
  },
  fieldRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
    justifyContent: "flex-end",
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    flex: 1,
    textAlign: "right",
    overflow: "hidden",
  },

  // Settings
  settingsContainer: {
    gap: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontFamily: "DMSans_500Medium",
    flex: 1,
  },

  // Divider
  divider: {
    height: 1,
    marginHorizontal: 4,
  },

  // Action Buttons
  actionButtons: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  saveBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 16,
  },
  discardBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  discardBtnText: {
    fontSize: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: "DMSans_600SemiBold",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 48,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontFamily: "DMSans_600SemiBold",
  },
});
