import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useTheme } from '@/lib/theme-context';
import { useToast } from '@/lib/toast-context';
import { formatCurrency } from '@/lib/mock-data';

const loanOffers = [
  { id: '1', name: 'Business Line of Credit', amount: 50000, rate: 7.5, term: '12 months', icon: 'briefcase' },
  { id: '2', name: 'Equipment Financing', amount: 25000, rate: 5.9, term: '24 months', icon: 'tool' },
  { id: '3', name: 'Working Capital Loan', amount: 100000, rate: 8.2, term: '36 months', icon: 'trending-up' },
];

const activeLoans = [
  { id: 'a1', name: 'Business Expansion', originalAmount: 30000, remainingBalance: 18500, monthlyPayment: 1250, nextPayment: '2026-03-01', rate: 6.5, progress: 0.38 },
];

const schedule = [
  { date: 'Mar 1, 2026', amount: 1250, principal: 985, interest: 265, balance: 17515 },
  { date: 'Apr 1, 2026', amount: 1250, principal: 990, interest: 260, balance: 16525 },
  { date: 'May 1, 2026', amount: 1250, principal: 996, interest: 254, balance: 15529 },
  { date: 'Jun 1, 2026', amount: 1250, principal: 1001, interest: 249, balance: 14528 },
  { date: 'Jul 1, 2026', amount: 1250, principal: 1007, interest: 243, balance: 13521 },
];

export default function LoansScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const [tab, setTab] = useState<'active' | 'offers' | 'schedule'>('active');

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Loans</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabs}>
        {(['active', 'offers', 'schedule'] as const).map(t => (
          <Pressable key={t} style={[styles.tab, { backgroundColor: tab === t ? colors.primary : colors.card }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setTab(t); }}>
            <Text style={[styles.tabText, { color: tab === t ? '#fff' : colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {tab === 'active' && activeLoans.map(loan => (
          <View key={loan.id} style={[styles.loanCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.loanName, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{loan.name}</Text>
            <View style={styles.loanRow}>
              <View>
                <Text style={[styles.loanLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Remaining</Text>
                <Text style={[styles.loanValue, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(loan.remainingBalance)}</Text>
              </View>
              <View>
                <Text style={[styles.loanLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Monthly</Text>
                <Text style={[styles.loanValue, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(loan.monthlyPayment)}</Text>
              </View>
              <View>
                <Text style={[styles.loanLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Rate</Text>
                <Text style={[styles.loanValue, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>{loan.rate}%</Text>
              </View>
            </View>
            <View style={[styles.progressBg, { backgroundColor: colors.border }]}>
              <View style={[styles.progressFill, { width: `${loan.progress * 100}%`, backgroundColor: colors.primary }]} />
            </View>
            <Text style={[styles.progressText, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
              {(loan.progress * 100).toFixed(0)}% paid off - {formatCurrency(loan.originalAmount - loan.remainingBalance)} of {formatCurrency(loan.originalAmount)}
            </Text>
          </View>
        ))}

        {tab === 'offers' && loanOffers.map(offer => (
          <View key={offer.id} style={[styles.offerCard, { backgroundColor: colors.card }]}>
            <View style={[styles.offerIcon, { backgroundColor: colors.accentMuted }]}>
              <Feather name={offer.icon as any} size={20} color={colors.accent} />
            </View>
            <View style={styles.offerInfo}>
              <Text style={[styles.offerName, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{offer.name}</Text>
              <Text style={[styles.offerDetails, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
                Up to {formatCurrency(offer.amount)} at {offer.rate}% APR for {offer.term}
              </Text>
            </View>
            <Pressable style={[styles.applyBtn, { backgroundColor: colors.primary }]}
              onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); showToast('Application submitted!', 'success'); }}>
              <Text style={[styles.applyText, { fontFamily: 'DMSans_600SemiBold' }]}>Apply</Text>
            </Pressable>
          </View>
        ))}

        {tab === 'schedule' && (
          <View style={[styles.scheduleCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.scheduleTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Repayment Schedule</Text>
            <View style={styles.scheduleHeader}>
              <Text style={[styles.schHeaderText, { color: colors.textTertiary, fontFamily: 'DMSans_500Medium', flex: 1 }]}>Date</Text>
              <Text style={[styles.schHeaderText, { color: colors.textTertiary, fontFamily: 'DMSans_500Medium', width: 70, textAlign: 'right' }]}>Payment</Text>
              <Text style={[styles.schHeaderText, { color: colors.textTertiary, fontFamily: 'DMSans_500Medium', width: 80, textAlign: 'right' }]}>Balance</Text>
            </View>
            {schedule.map((s, i) => (
              <View key={i}>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.scheduleRow}>
                  <Text style={[styles.schDate, { color: colors.text, fontFamily: 'DMSans_500Medium', flex: 1 }]}>{s.date}</Text>
                  <Text style={[styles.schAmount, { color: colors.text, fontFamily: 'DMSans_500Medium', width: 70, textAlign: 'right' }]}>{formatCurrency(s.amount)}</Text>
                  <Text style={[styles.schBalance, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular', width: 80, textAlign: 'right' }]}>{formatCurrency(s.balance)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 17 },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 13 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  loanCard: { borderRadius: 18, padding: 20, marginBottom: 16 },
  loanName: { fontSize: 17, marginBottom: 16 },
  loanRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  loanLabel: { fontSize: 12, marginBottom: 4 },
  loanValue: { fontSize: 18 },
  progressBg: { height: 6, borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 6, borderRadius: 3 },
  progressText: { fontSize: 12 },
  offerCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, gap: 12, marginBottom: 10 },
  offerIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  offerInfo: { flex: 1 },
  offerName: { fontSize: 14, marginBottom: 3 },
  offerDetails: { fontSize: 12, lineHeight: 16 },
  applyBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  applyText: { color: '#fff', fontSize: 13 },
  scheduleCard: { borderRadius: 18, padding: 20 },
  scheduleTitle: { fontSize: 16, marginBottom: 14 },
  scheduleHeader: { flexDirection: 'row', paddingVertical: 6 },
  schHeaderText: { fontSize: 11, textTransform: 'uppercase' },
  scheduleRow: { flexDirection: 'row', paddingVertical: 10 },
  schDate: { fontSize: 13 },
  schAmount: { fontSize: 13 },
  schBalance: { fontSize: 13 },
  divider: { height: 1 },
});
