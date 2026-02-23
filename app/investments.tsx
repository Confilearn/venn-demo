import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useTheme } from '@/lib/theme-context';
import { formatCurrency } from '@/lib/mock-data';

const portfolio = {
  totalValue: 32450.80,
  totalReturn: 4235.60,
  returnPercent: 15.02,
};

const assets = [
  { id: '1', name: 'S&P 500 ETF', ticker: 'SPY', shares: 12.5, price: 542.30, change: 1.24, value: 6778.75, color: '#00D09C' },
  { id: '2', name: 'Apple Inc.', ticker: 'AAPL', shares: 25, price: 198.50, change: -0.45, value: 4962.50, color: '#4C7CFF' },
  { id: '3', name: 'Bitcoin', ticker: 'BTC', shares: 0.15, price: 67240.00, change: 3.12, value: 10086.00, color: '#FFB020' },
  { id: '4', name: 'US Treasury Bond', ticker: 'TLT', shares: 40, price: 92.80, change: 0.18, value: 3712.00, color: '#9B59B6' },
  { id: '5', name: 'Gold ETF', ticker: 'GLD', shares: 20, price: 195.55, change: 0.65, value: 3911.00, color: '#FF6B8A' },
  { id: '6', name: 'Venn Cash Reserve', ticker: 'CASH', shares: 1, price: 3000.55, change: 0.02, value: 3000.55, color: '#00D09C' },
];

export default function InvestmentsScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === 'web' ? 67 : 0;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Investments</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.portfolioCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.portfolioLabel, { color: colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>Portfolio Value</Text>
          <Text style={[styles.portfolioValue, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(portfolio.totalValue)}</Text>
          <View style={[styles.returnBadge, { backgroundColor: colors.primaryMuted }]}>
            <Feather name="trending-up" size={14} color={colors.primary} />
            <Text style={[styles.returnText, { color: colors.primary, fontFamily: 'DMSans_600SemiBold' }]}>
              +{formatCurrency(portfolio.totalReturn)} ({portfolio.returnPercent}%)
            </Text>
          </View>
        </View>

        <View style={[styles.allocationCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Allocation</Text>
          <View style={styles.allocationBar}>
            {assets.map(a => (
              <View key={a.id} style={[styles.allocSegment, { flex: a.value / portfolio.totalValue, backgroundColor: a.color }]} />
            ))}
          </View>
          <View style={styles.allocLegend}>
            {assets.map(a => (
              <View key={a.id} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: a.color }]} />
                <Text style={[styles.legendLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{a.ticker}</Text>
                <Text style={[styles.legendPercent, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  {((a.value / portfolio.totalValue) * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold', marginBottom: 12 }]}>Holdings</Text>
        <View style={styles.assetList}>
          {assets.map(a => (
            <View key={a.id} style={[styles.assetItem, { backgroundColor: colors.card }]}>
              <View style={[styles.assetIcon, { backgroundColor: a.color + '20' }]}>
                <Text style={[styles.assetTicker, { color: a.color, fontFamily: 'DMSans_700Bold' }]}>{a.ticker.substring(0, 2)}</Text>
              </View>
              <View style={styles.assetInfo}>
                <Text style={[styles.assetName, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{a.name}</Text>
                <Text style={[styles.assetShares, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{a.shares} shares</Text>
              </View>
              <View style={styles.assetRight}>
                <Text style={[styles.assetValue, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{formatCurrency(a.value)}</Text>
                <Text style={[styles.assetChange, { color: a.change >= 0 ? colors.success : colors.error, fontFamily: 'DMSans_500Medium' }]}>
                  {a.change >= 0 ? '+' : ''}{a.change}%
                </Text>
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
  portfolioCard: { borderRadius: 18, padding: 24, marginBottom: 16, alignItems: 'center' },
  portfolioLabel: { fontSize: 13, marginBottom: 6 },
  portfolioValue: { fontSize: 36, marginBottom: 10 },
  returnBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  returnText: { fontSize: 13 },
  allocationCard: { borderRadius: 18, padding: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 16, marginBottom: 14 },
  allocationBar: { flexDirection: 'row', height: 10, borderRadius: 5, overflow: 'hidden', gap: 2, marginBottom: 14 },
  allocSegment: { borderRadius: 5 },
  allocLegend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendLabel: { fontSize: 11 },
  legendPercent: { fontSize: 11 },
  assetList: { gap: 8 },
  assetItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, gap: 12 },
  assetIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  assetTicker: { fontSize: 14 },
  assetInfo: { flex: 1 },
  assetName: { fontSize: 14, marginBottom: 2 },
  assetShares: { fontSize: 12 },
  assetRight: { alignItems: 'flex-end' },
  assetValue: { fontSize: 14, marginBottom: 2 },
  assetChange: { fontSize: 12 },
});
