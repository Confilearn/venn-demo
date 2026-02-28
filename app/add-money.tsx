import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { accounts, formatCurrency } from "@/lib/mock-data";

type Step = "method" | "amount" | "success";

const methods = [
  {
    id: "bank",
    icon: "briefcase",
    label: "Bank Transfer",
    desc: "ACH or Wire transfer",
    time: "1-3 business days",
  },
  {
    id: "card",
    icon: "credit-card",
    label: "Debit Card",
    desc: "Instant deposit",
    time: "Instant",
  },
  {
    id: "interac",
    icon: "zap",
    label: "Interac e-Transfer",
    desc: "Canadian accounts",
    time: "< 30 minutes",
  },
];

export default function AddMoneyScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === "web" ? 67 : 0;
  const [step, setStep] = useState<Step>("method");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep("success");
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (step === "amount") setStep("method");
            else router.back();
          }}
          hitSlop={12}
        >
          <Feather
            name={step === "method" || step === "success" ? "x" : "arrow-left"}
            size={24}
            color={colors.text}
          />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            { color: colors.text, fontFamily: "DMSans_600SemiBold" },
          ]}
        >
          Add Money
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {step === "method" && (
          <View>
            <Text
              style={[
                styles.stepTitle,
                { color: colors.text, fontFamily: "DMSans_700Bold" },
              ]}
            >
              Choose Method
            </Text>
            <Text
              style={[
                styles.stepDesc,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              How would you like to add funds?
            </Text>
            <View style={styles.methodList}>
              {methods.map((m) => (
                <Pressable
                  key={m.id}
                  style={({ pressed }) => [
                    styles.methodItem,
                    {
                      backgroundColor: colors.card,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedMethod(m.id);
                    setStep("amount");
                  }}
                >
                  <View
                    style={[
                      styles.methodIcon,
                      { backgroundColor: colors.primaryMuted },
                    ]}
                  >
                    <Feather
                      name={m.icon as any}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text
                      style={[
                        styles.methodLabel,
                        {
                          color: colors.text,
                          fontFamily: "DMSans_600SemiBold",
                        },
                      ]}
                    >
                      {m.label}
                    </Text>
                    <Text
                      style={[
                        styles.methodDesc,
                        {
                          color: colors.textSecondary,
                          fontFamily: "DMSans_400Regular",
                        },
                      ]}
                    >
                      {m.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.timeBadge,
                      { backgroundColor: colors.primaryMuted },
                    ]}
                  >
                    <Text
                      style={[
                        styles.timeText,
                        {
                          color: colors.primary,
                          fontFamily: "DMSans_500Medium",
                        },
                      ]}
                    >
                      {m.time}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {step === "amount" && (
          <View>
            <Text
              style={[
                styles.stepTitle,
                { color: colors.text, fontFamily: "DMSans_700Bold" },
              ]}
            >
              Enter Amount
            </Text>
            <Text
              style={[
                styles.stepDesc,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Deposit to {selectedAccount.name}
            </Text>
            <View style={styles.amountInput}>
              <Text
                style={[
                  styles.currencyPrefix,
                  { color: colors.textTertiary, fontFamily: "DMSans_700Bold" },
                ]}
              >
                $
              </Text>
              <TextInput
                style={[
                  styles.amountField,
                  { color: colors.text, fontFamily: "DMSans_700Bold" },
                ]}
                placeholder="0.00"
                placeholderTextColor={colors.textTertiary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
                autoFocus
              />
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor:
                    amount && parseFloat(amount) > 0
                      ? colors.primary
                      : colors.card,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
              onPress={handleDeposit}
              disabled={!amount || parseFloat(amount) <= 0 || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.btnText,
                    {
                      color:
                        amount && parseFloat(amount) > 0
                          ? "#fff"
                          : colors.textTertiary,
                      fontFamily: "DMSans_600SemiBold",
                    },
                  ]}
                >
                  Add Funds
                </Text>
              )}
            </Pressable>
          </View>
        )}

        {step === "success" && (
          <View style={styles.successContainer}>
            <View
              style={[
                styles.successIcon,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Feather name="check" size={40} color={colors.primary} />
            </View>
            <Text
              style={[
                styles.successTitle,
                { color: colors.text, fontFamily: "DMSans_700Bold" },
              ]}
            >
              Funds Added
            </Text>
            <Text
              style={[
                styles.successDesc,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              {formatCurrency(parseFloat(amount))} will be deposited to your{" "}
              {selectedAccount.currency} account
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.btn,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.9 : 1,
                  marginHorizontal: 20,
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.back();
              }}
            >
              <Text
                style={[
                  styles.btnText,
                  { color: "#fff", fontFamily: "DMSans_600SemiBold" },
                ]}
              >
                Done
              </Text>
            </Pressable>
          </View>
        )}
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
  content: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },
  stepTitle: { fontSize: 24, marginBottom: 6 },
  stepDesc: { fontSize: 14, marginBottom: 24 },
  methodList: { gap: 10 },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    gap: 12,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  methodInfo: { flex: 1 },
  methodLabel: { fontSize: 15, marginBottom: 2 },
  methodDesc: { fontSize: 12 },
  timeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  timeText: { fontSize: 11 },
  amountInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  currencyPrefix: { fontSize: 36, marginRight: 4 },
  amountField: { fontSize: 48, minWidth: 100, textAlign: "center" },
  btn: {
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  btnText: { fontSize: 16 },
  successContainer: { alignItems: "center", paddingTop: 60 },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  successTitle: { fontSize: 24, marginBottom: 10 },
  successDesc: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
});
