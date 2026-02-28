import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { invoices, formatCurrency } from "@/lib/mock-data";

function InvoiceListView({
  colors,
  onSelect,
}: {
  colors: any;
  onSelect: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "overdue">(
    "all",
  );
  const filtered =
    filter === "all" ? invoices : invoices.filter((i) => i.status === filter);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {(["all", "paid", "unpaid", "overdue"] as const).map((f) => (
          <Pressable
            key={f}
            style={[
              styles.filterChip,
              { backgroundColor: filter === f ? colors.primary : colors.card },
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setFilter(f);
            }}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color: filter === f ? "#fff" : colors.textSecondary,
                  fontFamily: "DMSans_500Medium",
                },
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.invoiceList}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="file-text" size={40} color={colors.textTertiary} />
            <Text
              style={[
                styles.emptyText,
                { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
              ]}
            >
              No invoices found
            </Text>
          </View>
        ) : (
          filtered.map((inv) => {
            const statusColor =
              inv.status === "paid"
                ? colors.success
                : inv.status === "overdue"
                  ? colors.error
                  : colors.warning;
            return (
              <Pressable
                key={inv.id}
                style={({ pressed }) => [
                  styles.invoiceItem,
                  { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onSelect(inv.id);
                }}
              >
                <View
                  style={[
                    styles.invIcon,
                    { backgroundColor: colors.accentMuted },
                  ]}
                >
                  <Feather name="file-text" size={18} color={colors.accent} />
                </View>
                <View style={styles.invInfo}>
                  <Text
                    style={[
                      styles.invNumber,
                      { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                    ]}
                  >
                    {inv.invoiceNumber}
                  </Text>
                  <Text
                    style={[
                      styles.invClient,
                      {
                        color: colors.textSecondary,
                        fontFamily: "DMSans_400Regular",
                      },
                    ]}
                  >
                    {inv.client}
                  </Text>
                </View>
                <View style={styles.invRight}>
                  <Text
                    style={[
                      styles.invAmount,
                      { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                    ]}
                  >
                    {formatCurrency(inv.amount, inv.currency)}
                  </Text>
                  <View
                    style={[
                      styles.invStatus,
                      { backgroundColor: statusColor + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.invStatusText,
                        { color: statusColor, fontFamily: "DMSans_500Medium" },
                      ]}
                    >
                      {inv.status}
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </View>
    </>
  );
}

function InvoicePreview({
  invoice,
  colors,
}: {
  invoice: (typeof invoices)[0];
  colors: any;
}) {
  const statusColor =
    invoice.status === "paid"
      ? colors.success
      : invoice.status === "overdue"
        ? colors.error
        : colors.warning;
  const dueDate = new Date(invoice.dueDate);
  const issuedDate = new Date(invoice.issuedDate);

  return (
    <View>
      <View style={styles.previewHeader}>
        <View>
          <Text
            style={[
              styles.previewInvNum,
              { color: colors.text, fontFamily: "DMSans_700Bold" },
            ]}
          >
            {invoice.invoiceNumber}
          </Text>
          <Text
            style={[
              styles.previewClient,
              { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
            ]}
          >
            {invoice.client}
          </Text>
        </View>
        <View
          style={[styles.statusPill, { backgroundColor: statusColor + "20" }]}
        >
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text
            style={[
              styles.statusLabel,
              { color: statusColor, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            {invoice.status}
          </Text>
        </View>
      </View>

      <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
        <View style={styles.detailRow}>
          <Text
            style={[
              styles.dLabel,
              { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
            ]}
          >
            Amount
          </Text>
          <Text
            style={[
              styles.dValue,
              { color: colors.primary, fontFamily: "DMSans_700Bold" },
            ]}
          >
            {formatCurrency(invoice.amount, invoice.currency)}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.detailRow}>
          <Text
            style={[
              styles.dLabel,
              { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
            ]}
          >
            Issued
          </Text>
          <Text
            style={[
              styles.dValue,
              { color: colors.text, fontFamily: "DMSans_500Medium" },
            ]}
          >
            {issuedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.detailRow}>
          <Text
            style={[
              styles.dLabel,
              { color: colors.textSecondary, fontFamily: "DMSans_400Regular" },
            ]}
          >
            Due Date
          </Text>
          <Text
            style={[
              styles.dValue,
              { color: colors.text, fontFamily: "DMSans_500Medium" },
            ]}
          >
            {dueDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.detailCard,
          { backgroundColor: colors.card, marginTop: 16 },
        ]}
      >
        <Text
          style={[
            styles.itemsTitle,
            { color: colors.text, fontFamily: "DMSans_600SemiBold" },
          ]}
        >
          Line Items
        </Text>
        {invoice.items.map((item, i) => (
          <View key={i}>
            {i > 0 && (
              <View
                style={[styles.divider, { backgroundColor: colors.border }]}
              />
            )}
            <View style={styles.lineItem}>
              <View style={styles.lineInfo}>
                <Text
                  style={[
                    styles.lineDesc,
                    { color: colors.text, fontFamily: "DMSans_500Medium" },
                  ]}
                >
                  {item.description}
                </Text>
                <Text
                  style={[
                    styles.lineQty,
                    {
                      color: colors.textSecondary,
                      fontFamily: "DMSans_400Regular",
                    },
                  ]}
                >
                  Qty: {item.quantity}
                </Text>
              </View>
              <Text
                style={[
                  styles.linePrice,
                  { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                ]}
              >
                {formatCurrency(item.price * item.quantity, invoice.currency)}
              </Text>
            </View>
          </View>
        ))}
        <View
          style={[styles.totalDivider, { backgroundColor: colors.border }]}
        />
        <View style={styles.totalRow}>
          <Text
            style={[
              styles.totalLabel,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Total
          </Text>
          <Text
            style={[
              styles.totalValue,
              { color: colors.primary, fontFamily: "DMSans_700Bold" },
            ]}
          >
            {formatCurrency(invoice.amount, invoice.currency)}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function InvoiceDetailScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ view?: string; id?: string }>();
  const [selectedId, setSelectedId] = useState<string | null>(
    params.id || null,
  );
  const webTop = Platform.OS === "web" ? 67 : 0;

  const selectedInvoice = selectedId
    ? invoices.find((i) => i.id === selectedId)
    : null;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            if (selectedInvoice) {
              setSelectedId(null);
            } else {
              router.back();
            }
          }}
          hitSlop={12}
        >
          <Feather
            name={selectedInvoice ? "arrow-left" : "x"}
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
          {selectedInvoice ? selectedInvoice.invoiceNumber : "Invoices"}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {selectedInvoice ? (
          <InvoicePreview invoice={selectedInvoice} colors={colors} />
        ) : (
          <InvoiceListView colors={colors} onSelect={setSelectedId} />
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
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  filterRow: { gap: 8, marginBottom: 16 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  filterText: { fontSize: 13 },
  invoiceList: { gap: 8 },
  invoiceItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  invIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  invInfo: { flex: 1 },
  invNumber: { fontSize: 14, marginBottom: 2 },
  invClient: { fontSize: 12 },
  invRight: { alignItems: "flex-end" },
  invAmount: { fontSize: 14, marginBottom: 4 },
  invStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  invStatusText: { fontSize: 10, textTransform: "capitalize" },
  emptyState: { alignItems: "center", paddingVertical: 40 },
  emptyText: { fontSize: 15, marginTop: 12 },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingTop: 8,
  },
  previewInvNum: { fontSize: 24, marginBottom: 4 },
  previewClient: { fontSize: 14 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 12, textTransform: "capitalize" },
  detailCard: { borderRadius: 18, padding: 20 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  dLabel: { fontSize: 13 },
  dValue: { fontSize: 14 },
  divider: { height: 1, marginVertical: 2 },
  itemsTitle: { fontSize: 15, marginBottom: 12 },
  lineItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  lineInfo: { flex: 1 },
  lineDesc: { fontSize: 14, marginBottom: 2 },
  lineQty: { fontSize: 12 },
  linePrice: { fontSize: 14 },
  totalDivider: { height: 2, marginVertical: 10 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  totalLabel: { fontSize: 15 },
  totalValue: { fontSize: 18 },
});
