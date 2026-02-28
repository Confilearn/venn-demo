import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  useColorScheme,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useThemeColors } from "@/constants/colors";
import { accounts, formatCurrency } from "@/lib/mock-data";

export default function AccountDetailScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const account = accounts.find((a) => a.id === id);
  if (!account) {
    return (
      <View
        style={[
          styles.screen,
          {
            backgroundColor: colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Feather name="alert-circle" size={48} color={colors.textTertiary} />
        <Text
          style={[
            styles.emptyText,
            { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
          ]}
        >
          Account not found
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: colors.primary }]}
        >
          <Text
            style={[styles.backBtnText, { fontFamily: "DMSans_600SemiBold" }]}
          >
            Go Back
          </Text>
        </Pressable>
      </View>
    );
  }

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
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
          Account Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.balanceSection}>
          <View
            style={[
              styles.currencyIcon,
              { backgroundColor: colors.primaryMuted },
            ]}
          >
            <Text
              style={[
                styles.currencySymbol,
                { color: colors.primary, fontFamily: "DMSans_700Bold" },
              ]}
            >
              {account.currency}
            </Text>
          </View>
          <Text
            style={[
              styles.accName,
              { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
            ]}
          >
            {account.name}
          </Text>
          <Text
            style={[
              styles.balance,
              { color: colors.text, fontFamily: "DMSans_700Bold" },
            ]}
          >
            {formatCurrency(account.balance, account.currency)}
          </Text>
          <View
            style={[styles.typeBadge, { backgroundColor: colors.accentMuted }]}
          >
            <Text
              style={[
                styles.typeText,
                { color: colors.accent, fontFamily: "DMSans_500Medium" },
              ]}
            >
              {account.type}
            </Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/send-money");
            }}
          >
            <Feather name="send" size={18} color="#fff" />
            <Text
              style={[
                styles.actionBtnText,
                { fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Send
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: colors.accent, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/add-money");
            }}
          >
            <Feather name="plus" size={18} color="#fff" />
            <Text
              style={[
                styles.actionBtnText,
                { fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Add Money
            </Text>
          </Pressable>
        </View>

        <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.detailTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Account Information
          </Text>

          <CopyRow
            label="Account Number"
            value={account.accountNumber}
            colors={colors}
            onCopy={() => copyToClipboard(account.accountNumber)}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <CopyRow
            label="Routing / SWIFT"
            value={account.routingNumber}
            colors={colors}
            onCopy={() => copyToClipboard(account.routingNumber)}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow
            label="Currency"
            value={account.currency}
            colors={colors}
          />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow
            label="Account Type"
            value={account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            colors={colors}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: any;
}) {
  return (
    <View style={styles.detailRow}>
      <Text
        style={[
          styles.detailLabel,
          { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.detailValue,
          { color: colors.text, fontFamily: "DMSans_500Medium" },
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

function CopyRow({
  label,
  value,
  colors,
  onCopy,
}: {
  label: string;
  value: string;
  colors: any;
  onCopy: () => void;
}) {
  return (
    <View style={styles.detailRow}>
      <Text
        style={[
          styles.detailLabel,
          { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
        ]}
      >
        {label}
      </Text>
      <View style={styles.copyRow}>
        <Text
          style={[
            styles.detailValue,
            { color: colors.text, fontFamily: "DMSans_500Medium" },
          ]}
        >
          {value}
        </Text>
        <Pressable onPress={onCopy} hitSlop={8}>
          <Feather name="copy" size={14} color={colors.primary} />
        </Pressable>
      </View>
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
  balanceSection: { alignItems: "center", paddingVertical: 28 },
  currencyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  currencySymbol: { fontSize: 18 },
  accName: { fontSize: 14, marginBottom: 6 },
  balance: { fontSize: 36, marginBottom: 10 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  typeText: { fontSize: 12, textTransform: "capitalize" },
  quickActions: { flexDirection: "row", gap: 12, marginBottom: 24 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionBtnText: { color: "#fff", fontSize: 14 },
  detailCard: { borderRadius: 18, padding: 20 },
  detailTitle: { fontSize: 16, marginBottom: 16 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13 },
  copyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  divider: { height: 1, marginVertical: 2 },
  emptyText: { fontSize: 16, marginTop: 12, marginBottom: 20 },
  backBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  backBtnText: { color: "#fff", fontSize: 15 },
});
