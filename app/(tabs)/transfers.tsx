import React from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import {
  beneficiaries,
  transactions,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";

export default function TransfersScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 84 : 0;

  const transferTx = transactions.filter(
    (t) => t.category === "Transfer" || t.type === "debit",
  );

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16 + webTop,
          paddingBottom: 100 + webBottom,
        }}
      >
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.pageTitle,
              { color: colors.text, fontFamily: "DMSans_700Bold" },
            ]}
          >
            Transfers
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.sendBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push("/send-money");
            }}
          >
            <Feather name="send" size={16} color="#fff" />
            <Text
              style={[styles.sendBtnText, { fontFamily: "DMSans_600SemiBold" }]}
            >
              Send Money
            </Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text
              style={[
                styles.cardTitle,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Beneficiaries
            </Text>
            <Pressable
              onPress={() =>
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
              }
            >
              <Feather name="plus" size={20} color={colors.primary} />
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.beneficiaryRow}
          >
            {beneficiaries.map((b) => (
              <Pressable
                key={b.id}
                style={({ pressed }) => [
                  styles.beneficiary,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push("/send-money");
                }}
              >
                <View
                  style={[
                    styles.beneficiaryAvatar,
                    { backgroundColor: colors.accentMuted },
                  ]}
                >
                  <Text
                    style={[
                      styles.beneficiaryInitials,
                      { color: colors.accent, fontFamily: "DMSans_700Bold" },
                    ]}
                  >
                    {b.avatar}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.beneficiaryName,
                    {
                      color: colors.textSecondary,
                      fontFamily: "DMSans_500Medium",
                    },
                  ]}
                  numberOfLines={1}
                >
                  {b.name.split(" ")[0]}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Transfer History
          </Text>
          <View style={styles.txList}>
            {transferTx.map((tx) => {
              const statusColor =
                tx.status === "completed"
                  ? colors.success
                  : tx.status === "pending"
                    ? colors.warning
                    : colors.error;
              return (
                <Pressable
                  key={tx.id}
                  style={({ pressed }) => [
                    styles.txItem,
                    {
                      backgroundColor: colors.card,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({
                      pathname: "/transaction-detail",
                      params: { id: tx.id },
                    });
                  }}
                >
                  <View
                    style={[
                      styles.txIcon,
                      {
                        backgroundColor:
                          tx.type === "credit"
                            ? colors.primaryMuted
                            : colors.accentMuted,
                      },
                    ]}
                  >
                    <Feather
                      name={tx.icon as any}
                      size={18}
                      color={
                        tx.type === "credit" ? colors.primary : colors.accent
                      }
                    />
                  </View>
                  <View style={styles.txInfo}>
                    <Text
                      style={[
                        styles.txTitle,
                        {
                          color: colors.text,
                          fontFamily: "DMSans_600SemiBold",
                        },
                      ]}
                    >
                      {tx.title}
                    </Text>
                    <View style={styles.txMeta}>
                      <Text
                        style={[
                          styles.txDate,
                          {
                            color: colors.textSecondary,
                            fontFamily: "DMSans_400Regular",
                          },
                        ]}
                      >
                        {formatDate(tx.date)}
                      </Text>
                      {tx.status !== "completed" && (
                        <View
                          style={[
                            styles.statusBadge,
                            { backgroundColor: statusColor + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color: statusColor,
                                fontFamily: "DMSans_500Medium",
                              },
                            ]}
                          >
                            {tx.status}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.txAmount,
                      {
                        color:
                          tx.type === "credit" ? colors.success : colors.text,
                        fontFamily: "DMSans_600SemiBold",
                      },
                    ]}
                  >
                    {formatCurrency(tx.amount, tx.currency)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitle: { fontSize: 28 },
  sendBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  sendBtnText: { color: "#fff", fontSize: 13 },
  card: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: { fontSize: 16 },
  beneficiaryRow: { gap: 16 },
  beneficiary: { alignItems: "center", width: 60 },
  beneficiaryAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  beneficiaryInitials: { fontSize: 16 },
  beneficiaryName: { fontSize: 11 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, marginBottom: 12 },
  txList: { gap: 8 },
  txItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  txIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, marginBottom: 3 },
  txMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  txDate: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, textTransform: "capitalize" },
  txAmount: { fontSize: 14 },
});
