import React, { useEffect } from "react";
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
import { Feather, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { useAuth } from "@/lib/auth-context";
import {
  accounts,
  transactions,
  cashflowData,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from "react-native-reanimated";

function QuickAction({
  icon,
  label,
  color,
  onPress,
}: {
  icon: string;
  label: string;
  color: string;
  onPress: () => void;
}) {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  return (
    <Pressable
      style={({ pressed }) => [
        styles.quickAction,
        {
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.95 : 1 }],
        },
      ]}
      onPress={onPress}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + "20" }]}>
        <Feather name={icon as any} size={20} color={color} />
      </View>
      <Text
        style={[
          styles.quickActionLabel,
          { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function TransactionItem({
  item,
  index,
}: {
  item: (typeof transactions)[0];
  index: number;
}) {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    opacity.value = withDelay(index * 60, withTiming(1, { duration: 400 }));
    translateY.value = withDelay(index * 60, withTiming(0, { duration: 400 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const statusColor =
    item.status === "completed"
      ? colors.success
      : item.status === "pending"
        ? colors.warning
        : colors.error;

  return (
    <Animated.View style={animStyle}>
      <Pressable
        style={({ pressed }) => [
          styles.txItem,
          { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          router.push({
            pathname: "/transaction-detail",
            params: { id: item.id },
          });
        }}
      >
        <View
          style={[
            styles.txIcon,
            {
              backgroundColor:
                item.type === "credit"
                  ? colors.primaryMuted
                  : colors.accentMuted,
            },
          ]}
        >
          <Feather
            name={item.icon as any}
            size={18}
            color={item.type === "credit" ? colors.primary : colors.accent}
          />
        </View>
        <View style={styles.txInfo}>
          <Text
            style={[
              styles.txTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            {item.title}
          </Text>
          <View style={styles.txMeta}>
            <Text
              style={[
                styles.txDesc,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              {formatDate(item.date)}
            </Text>
            {item.status !== "completed" && (
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: statusColor, fontFamily: "DMSans_500Medium" },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            )}
          </View>
        </View>
        <Text
          style={[
            styles.txAmount,
            {
              color: item.type === "credit" ? colors.success : colors.text,
              fontFamily: "DMSans_600SemiBold",
            },
          ]}
        >
          {item.type === "credit" ? "+" : ""}
          {formatCurrency(item.amount, item.currency)}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

function CashflowBar({
  month,
  income,
  expenses,
  maxVal,
}: {
  month: string;
  income: number;
  expenses: number;
  maxVal: number;
}) {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const incomeHeight = (income / maxVal) * 60;
  const expenseHeight = (expenses / maxVal) * 60;

  return (
    <View style={styles.barGroup}>
      <View style={styles.bars}>
        <View
          style={[
            styles.bar,
            {
              height: incomeHeight,
              backgroundColor: colors.primary,
              borderRadius: 3,
            },
          ]}
        />
        <View
          style={[
            styles.bar,
            {
              height: expenseHeight,
              backgroundColor: colors.accent,
              borderRadius: 3,
            },
          ]}
        />
      </View>
      <Text
        style={[
          styles.barLabel,
          { color: colors.textTertiary, fontFamily: "DMSans_400Regular" },
        ]}
      >
        {month}
      </Text>
    </View>
  );
}

export default function DashboardScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { user, isAuthenticated } = useAuth();

  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 84 : 0;

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
  const recentTx = transactions.slice(0, 5);
  const maxVal = Math.max(
    ...cashflowData.monthlyData.map((d) => Math.max(d.income, d.expenses)),
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
        <View style={styles.topBar}>
          <View>
            <Text
              style={[
                styles.greeting,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Welcome back
            </Text>
            <Text
              style={[
                styles.userName,
                { color: colors.text, fontFamily: "DMSans_700Bold" },
              ]}
            >
              {user?.name?.split(" ")[0] || "User"}
            </Text>
          </View>
          <Pressable
            style={[styles.avatarBtn, { backgroundColor: colors.primary }]}
            onPress={() => router.push("/(tabs)/more")}
          >
            <Text style={[styles.avatarText, { fontFamily: "DMSans_700Bold" }]}>
              {user?.avatar || "U"}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.balanceCard, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.balanceLabel,
              { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
            ]}
          >
            Total Balance
          </Text>
          <Text
            style={[
              styles.balanceAmount,
              { color: colors.text, fontFamily: "DMSans_700Bold" },
            ]}
          >
            {formatCurrency(totalBalance)}
          </Text>
          <View style={styles.balanceChange}>
            <View
              style={[
                styles.changeBadge,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Feather name="trending-up" size={12} color={colors.primary} />
              <Text
                style={[
                  styles.changeText,
                  { color: colors.primary, fontFamily: "DMSans_600SemiBold" },
                ]}
              >
                +12.4%
              </Text>
            </View>
            <Text
              style={[
                styles.changePeriod,
                { color: colors.textTertiary, fontFamily: "DMSans_400Regular" },
              ]}
            >
              vs last month
            </Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <QuickAction
            icon="plus"
            label="Add"
            color={colors.primary}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/add-money");
            }}
          />
          <QuickAction
            icon="send"
            label="Send"
            color={colors.accent}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/send-money");
            }}
          />
          <QuickAction
            icon="repeat"
            label="Convert"
            color={colors.warning}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/convert-money");
            }}
          />
          <QuickAction
            icon="gift"
            label="Earn"
            color="#FF6B8A"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/earn");
            }}
          />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Cashflow
            </Text>
            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: colors.primary },
                  ]}
                />
                <Text
                  style={[
                    styles.legendLabel,
                    {
                      color: colors.textSecondary,
                      fontFamily: "DMSans_400Regular",
                    },
                  ]}
                >
                  Income
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: colors.accent }]}
                />
                <Text
                  style={[
                    styles.legendLabel,
                    {
                      color: colors.textSecondary,
                      fontFamily: "DMSans_400Regular",
                    },
                  ]}
                >
                  Expenses
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.cashflowStats}>
            <View>
              <Text
                style={[
                  styles.cfLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_400Regular",
                  },
                ]}
              >
                Income
              </Text>
              <Text
                style={[
                  styles.cfValue,
                  { color: colors.primary, fontFamily: "DMSans_700Bold" },
                ]}
              >
                {formatCurrency(cashflowData.income)}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.cfLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_400Regular",
                  },
                ]}
              >
                Expenses
              </Text>
              <Text
                style={[
                  styles.cfValue,
                  { color: colors.accent, fontFamily: "DMSans_700Bold" },
                ]}
              >
                {formatCurrency(cashflowData.expenses)}
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.cfLabel,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_400Regular",
                  },
                ]}
              >
                Net
              </Text>
              <Text
                style={[
                  styles.cfValue,
                  { color: colors.success, fontFamily: "DMSans_700Bold" },
                ]}
              >
                +{formatCurrency(cashflowData.net)}
              </Text>
            </View>
          </View>
          <View style={styles.chart}>
            {cashflowData.monthlyData.map((d) => (
              <CashflowBar
                key={d.month}
                month={d.month}
                income={d.income}
                expenses={d.expenses}
                maxVal={maxVal}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Recent Transactions
            </Text>
            <Pressable onPress={() => router.push("/(tabs)/accounts")}>
              <Text
                style={[
                  styles.seeAll,
                  { color: colors.primary, fontFamily: "DMSans_600SemiBold" },
                ]}
              >
                See All
              </Text>
            </Pressable>
          </View>
          <View style={styles.txList}>
            {recentTx.map((tx, i) => (
              <TransactionItem key={tx.id} item={tx} index={i} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: { fontSize: 14, marginBottom: 2 },
  userName: { fontSize: 22 },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 16 },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
  },
  balanceLabel: { fontSize: 13, marginBottom: 6 },
  balanceAmount: { fontSize: 36, marginBottom: 10 },
  balanceChange: { flexDirection: "row", alignItems: "center", gap: 8 },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  changeText: { fontSize: 12 },
  changePeriod: { fontSize: 12 },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickAction: { alignItems: "center", gap: 8 },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: { fontSize: 12 },
  sectionCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 17 },
  legendRow: { flexDirection: "row", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11 },
  cashflowStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cfLabel: { fontSize: 12, marginBottom: 4 },
  cfValue: { fontSize: 16 },
  chart: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 80,
  },
  barGroup: { alignItems: "center", gap: 6 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 3 },
  bar: { width: 14 },
  barLabel: { fontSize: 10 },
  section: { paddingHorizontal: 20 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13 },
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
  txDesc: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, textTransform: "capitalize" },
  txAmount: { fontSize: 14 },
});
