import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useColorScheme, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { transactions, formatCurrency } from '@/lib/mock-data';

export default function TransactionDetailScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const webTop = Platform.OS === 'web' ? 67 : 0;

  const tx = transactions.find(t => t.id === id);
  if (!tx) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Feather name="alert-circle" size={48} color={colors.textTertiary} />
        <Text style={[styles.emptyText, { color: colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>Transaction not found</Text>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.backBtnText, { fontFamily: 'DMSans_600SemiBold' }]}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const statusColor = tx.status === 'completed' ? colors.success : tx.status === 'pending' ? colors.warning : colors.error;
  const date = new Date(tx.date);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Transaction</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.amountSection}>
          <View style={[styles.txIconLarge, { backgroundColor: tx.type === 'credit' ? colors.primaryMuted : colors.accentMuted }]}>
            <Feather name={tx.icon as any} size={28} color={tx.type === 'credit' ? colors.primary : colors.accent} />
          </View>
          <Text style={[styles.amount, { color: tx.type === 'credit' ? colors.success : colors.text, fontFamily: 'DMSans_700Bold' }]}>
            {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount, tx.currency)}
          </Text>
          <View style={[styles.statusPill, { backgroundColor: statusColor + '20' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusLabel, { color: statusColor, fontFamily: 'DMSans_600SemiBold' }]}>{tx.status}</Text>
          </View>
        </View>

        <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
          <DetailRow label="Merchant" value={tx.title} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow label="Description" value={tx.description} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow label="Date" value={date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow label="Category" value={tx.category} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow label="Currency" value={tx.currency} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <DetailRow label="Reference" value={`TXN-${tx.id.padStart(8, '0')}`} colors={colors} />
        </View>
      </ScrollView>
    </View>
  );
}

function DetailRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{label}</Text>
      <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 17 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  amountSection: { alignItems: 'center', paddingVertical: 32 },
  txIconLarge: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  amount: { fontSize: 36, marginBottom: 12 },
  statusPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 13, textTransform: 'capitalize' },
  detailCard: { borderRadius: 18, padding: 20 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, textAlign: 'right', flex: 1, marginLeft: 20 },
  divider: { height: 1, marginVertical: 2 },
  emptyText: { fontSize: 16, marginTop: 12, marginBottom: 20 },
  backBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  backBtnText: { color: '#fff', fontSize: 15 },
});
