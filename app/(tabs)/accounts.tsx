import React from 'react';
import { View, Text, ScrollView, Pressable, FlatList, StyleSheet, useColorScheme, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { accounts, transactions, formatCurrency, formatDate } from '@/lib/mock-data';

export default function AccountsScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const webBottom = Platform.OS === 'web' ? 84 : 0;

  const currencyFlags: Record<string, string> = { USD: 'US', CAD: 'CA', EUR: 'EU', GBP: 'GB' };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 16 + webTop, paddingBottom: 100 + webBottom }}>
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Accounts</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.accountCards}>
          {accounts.map((acc) => (
            <Pressable
              key={acc.id}
              style={({ pressed }) => [styles.accountCard, { backgroundColor: colors.card, opacity: pressed ? 0.85 : 1 }]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push({ pathname: '/account-detail', params: { id: acc.id } });
              }}
            >
              <View style={styles.accCardTop}>
                <View style={[styles.currencyBadge, { backgroundColor: colors.primaryMuted }]}>
                  <Text style={[styles.currencyCode, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>{acc.currency}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={colors.textTertiary} />
              </View>
              <Text style={[styles.accName, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{acc.name}</Text>
              <Text style={[styles.accBalance, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(acc.balance, acc.currency)}</Text>
              <Text style={[styles.accNumber, { color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }]}>{acc.accountNumber}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>All Transactions</Text>
          <View style={styles.txList}>
            {transactions.map((tx) => {
              const statusColor = tx.status === 'completed' ? colors.success : tx.status === 'pending' ? colors.warning : colors.error;
              return (
                <Pressable
                  key={tx.id}
                  style={({ pressed }) => [styles.txItem, { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push({ pathname: '/transaction-detail', params: { id: tx.id } });
                  }}
                >
                  <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' ? colors.primaryMuted : colors.accentMuted }]}>
                    <Feather name={tx.icon as any} size={18} color={tx.type === 'credit' ? colors.primary : colors.accent} />
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={[styles.txTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{tx.title}</Text>
                    <View style={styles.txMeta}>
                      <Text style={[styles.txDesc, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{formatDate(tx.date)}</Text>
                      {tx.status !== 'completed' && (
                        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                          <Text style={[styles.statusText, { color: statusColor, fontFamily: 'DMSans_500Medium' }]}>{tx.status}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.txAmount, { color: tx.type === 'credit' ? colors.success : colors.text, fontFamily: 'DMSans_600SemiBold' }]}>
                    {tx.type === 'credit' ? '+' : ''}{formatCurrency(tx.amount, tx.currency)}
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
  pageTitle: { fontSize: 28, paddingHorizontal: 20, marginBottom: 20 },
  accountCards: { paddingHorizontal: 20, gap: 12, marginBottom: 28 },
  accountCard: { width: 200, borderRadius: 18, padding: 18 },
  accCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  currencyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  currencyCode: { fontSize: 13 },
  accName: { fontSize: 12, marginBottom: 4 },
  accBalance: { fontSize: 22, marginBottom: 6 },
  accNumber: { fontSize: 11 },
  section: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 17, marginBottom: 12 },
  txList: { gap: 8 },
  txItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, gap: 12 },
  txIcon: { width: 42, height: 42, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  txInfo: { flex: 1 },
  txTitle: { fontSize: 14, marginBottom: 3 },
  txMeta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  txDesc: { fontSize: 12 },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  statusText: { fontSize: 10, textTransform: 'capitalize' },
  txAmount: { fontSize: 14 },
});
