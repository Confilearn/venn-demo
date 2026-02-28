import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Platform,
  Linking,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";

export default function HelpSupportScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const helpCategories = [
    {
      title: "Getting Started",
      icon: "book-open",
      items: [
        "How to add money",
        "How to send money",
        "Understanding your dashboard",
        "Setting up your profile",
      ],
    },
    {
      title: "Account & Security",
      icon: "shield",
      items: [
        "Managing your account settings",
        "Security best practices",
        "Privacy and data protection",
        "Reporting suspicious activity",
      ],
    },
    {
      title: "Transactions & Payments",
      icon: "credit-card",
      items: [
        "Understanding transaction history",
        "Payment disputes",
        "International transfers",
        "Currency conversion",
      ],
    },
    {
      title: "Technical Support",
      icon: "headphones",
      items: [
        "App troubleshooting",
        "Login issues",
        "Payment problems",
        "Feature requests",
      ],
    },
    {
      title: "Contact Us",
      icon: "message-circle",
      items: [
        "Live chat support",
        "Email support",
        "Phone support",
        "Office locations",
      ],
    },
  ];

  const handleContact = (method: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    switch (method) {
      case "email":
        Linking.openURL("mailto:support@venn.ca");
        break;
      case "phone":
        Linking.openURL("tel:+1-800-VENN-HELP");
        break;
      case "chat":
        Linking.openURL("https://venn.ca/chat");
        break;
    }
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
          Help & Support
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {helpCategories.map((category, index) => (
          <View key={index} style={styles.categoryCard}>
            <View style={styles.categoryHeader}>
              <View
                style={[
                  styles.categoryIcon,
                  { backgroundColor: colors.primaryMuted },
                ]}
              >
                <Feather
                  name={category.icon as any}
                  size={20}
                  color={colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.categoryTitle,
                  { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                ]}
              >
                {category.title}
              </Text>
            </View>

            <View style={styles.helpItems}>
              {category.items.map((item, itemIndex) => (
                <Pressable
                  key={itemIndex}
                  style={({ pressed }) => [
                    styles.helpItem,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                  onPress={() =>
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
                  }
                >
                  <Text
                    style={[
                      styles.helpItemText,
                      { color: colors.text, fontFamily: "DMSans_400Regular" },
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.contactSection}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Contact Us
          </Text>

          <View style={styles.contactMethods}>
            <Pressable
              style={[styles.contactBtn, { backgroundColor: colors.primary }]}
              onPress={() => handleContact("email")}
            >
              <Feather name="mail" size={16} color="#fff" />
              <Text
                style={[
                  styles.contactBtnText,
                  { fontFamily: "DMSans_500Medium" },
                ]}
              >
                Email Support
              </Text>
            </Pressable>

            <Pressable
              style={[styles.contactBtn, { backgroundColor: colors.accent }]}
              onPress={() => handleContact("phone")}
            >
              <Feather name="phone" size={16} color="#fff" />
              <Text
                style={[
                  styles.contactBtnText,
                  { fontFamily: "DMSans_500Medium" },
                ]}
              >
                Phone Support
              </Text>
            </Pressable>

            <Pressable
              style={[styles.contactBtn, { backgroundColor: colors.warning }]}
              onPress={() => handleContact("chat")}
            >
              <Feather name="message-circle" size={16} color="#fff" />
              <Text
                style={[
                  styles.contactBtnText,
                  { fontFamily: "DMSans_500Medium" },
                ]}
              >
                Live Chat
              </Text>
            </Pressable>
          </View>
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
  sectionTitle: { fontSize: 16, marginBottom: 20, marginTop: 24 },
  categoryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitle: {
    fontSize: 15,
  },
  helpItems: {
    gap: 8,
  },
  helpItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  helpItemText: {
    fontSize: 14,
  },
  contactSection: {
    marginTop: 24,
  },
  contactMethods: {
    gap: 12,
  },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    paddingHorizontal: 16,
  },
  contactBtnText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 8,
  },
});
