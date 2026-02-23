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

const monthlyData = [
  { month: 'Sep 2025', income: 12400, expenses: 7200 },
  { month: 'Oct 2025', income: 14800, expenses: 8100 },
  { month: 'Nov 2025', income: 11200, expenses: 6900 },
  { month: 'Dec 2025', income: 18500, expenses: 9200 },
  { month: 'Jan 2026', income: 15300, expenses: 7800 },
  { month: 'Feb 2026', income: 16130, expenses: 8569 },
];

const categories = [
  { name: 'Software & SaaS', amount: 3245.49, percent: 37.9, color: '#4C7CFF' },
  { name: 'Cloud & Hosting', amount: 2340.50, percent: 27.3, color: '#00D09C' },
  { name: 'Office & Supplies', amount: 1456.30, percent: 17.0, color: '#FFB020' },
  { name: 'Marketing', amount: 892.00, percent: 10.4, color: '#FF6B8A' },
  { name: 'Other', amount: 635.00, percent: 7.4, color: '#9B59B6' },
];

export default function AccountingScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const webTop = Platform.OS === 'web' ? 67 : 0;

  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses, 0);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Accounting</Text>
        <Pressable onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); showToast('Report exported to email', 'success'); }}>
          <Feather name="download" size={20} color={colors.primary} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Feather name="trending-up" size={18} color={colors.primary} />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Total Income</Text>
            <Text style={[styles.summaryValue, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(totalIncome)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Feather name="trending-down" size={18} color={colors.error} />
            <Text style={[styles.summaryLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Total Expenses</Text>
            <Text style={[styles.summaryValue, { color: colors.error, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(totalExpenses)}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Monthly Summary</Text>
          {monthlyData.map((m, i) => {
            const net = m.income - m.expenses;
            return (
              <View key={i}>
                {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
                <View style={styles.monthRow}>
                  <Text style={[styles.monthName, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{m.month}</Text>
                  <View style={styles.monthValues}>
                    <Text style={[styles.monthIncome, { color: colors.primary, fontFamily: 'DMSans_500Medium' }]}>+{formatCurrency(m.income)}</Text>
                    <Text style={[styles.monthNet, { color: net >= 0 ? colors.success : colors.error, fontFamily: 'DMSans_600SemiBold' }]}>
                      {net >= 0 ? '+' : ''}{formatCurrency(net)}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Expense Breakdown</Text>
          <View style={styles.breakdownBar}>
            {categories.map(c => (
              <View key={c.name} style={[styles.breakdownSegment, { flex: c.percent, backgroundColor: c.color }]} />
            ))}
          </View>
          {categories.map((c, i) => (
            <View key={c.name}>
              {i > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <View style={styles.catRow}>
                <View style={[styles.catDot, { backgroundColor: c.color }]} />
                <Text style={[styles.catName, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{c.name}</Text>
                <Text style={[styles.catPercent, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{c.percent}%</Text>
                <Text style={[styles.catAmount, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{formatCurrency(c.amount)}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 17 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, borderRadius: 16, padding: 16, gap: 8 },
  summaryLabel: { fontSize: 12 },
  summaryValue: { fontSize: 20 },
  card: { borderRadius: 18, padding: 20, marginBottom: 16 },
  cardTitle: { fontSize: 16, marginBottom: 14 },
  divider: { height: 1, marginVertical: 2 },
  monthRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10 },
  monthName: { fontSize: 14 },
  monthValues: { alignItems: 'flex-end' },
  monthIncome: { fontSize: 12, marginBottom: 2 },
  monthNet: { fontSize: 14 },
  breakdownBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2, marginBottom: 16 },
  breakdownSegment: { borderRadius: 5 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10 },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  catName: { flex: 1, fontSize: 13 },
  catPercent: { fontSize: 12, width: 40, textAlign: 'right' },
  catAmount: { fontSize: 13, width: 80, textAlign: 'right' },
});
