import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useTheme } from '@/lib/theme-context';
import { formatCurrency } from '@/lib/mock-data';

const currencies = [
  { code: 'USD', name: 'US Dollar', rate: 1.0 },
  { code: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'EUR', name: 'Euro', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', rate: 0.79 },
];

export default function ConvertMoneyScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const [fromCurrency, setFromCurrency] = useState(currencies[0]);
  const [toCurrency, setToCurrency] = useState(currencies[1]);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const convertedAmount = amount ? (parseFloat(amount) * (toCurrency.rate / fromCurrency.rate)) : 0;

  const handleSwap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleConvert = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSuccess(true);
  };

  if (success) {
    return (
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}><Feather name="x" size={24} color={colors.text} /></Pressable>
          <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Convert</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.successContainer}>
          <View style={[styles.successIcon, { backgroundColor: colors.primaryMuted }]}><Feather name="check" size={40} color={colors.primary} /></View>
          <Text style={[styles.successTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Conversion Complete</Text>
          <Text style={[styles.successDesc, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
            {formatCurrency(parseFloat(amount), fromCurrency.code)} converted to {formatCurrency(convertedAmount, toCurrency.code)}
          </Text>
          <Pressable style={({ pressed }) => [styles.btn, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1, width: '100%' }]}
            onPress={() => router.back()}>
            <Text style={[styles.btnText, { color: '#fff', fontFamily: 'DMSans_600SemiBold' }]}>Done</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Convert Currency</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={[styles.convertCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>From</Text>
          <View style={styles.currencyRow}>
            <View style={[styles.currencyBadge, { backgroundColor: colors.primaryMuted }]}>
              <Text style={[styles.currencyCode, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>{fromCurrency.code}</Text>
            </View>
            <TextInput style={[styles.amountField, { color: colors.text, fontFamily: 'DMSans_700Bold' }]} placeholder="0.00" placeholderTextColor={colors.textTertiary} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
          </View>
        </View>

        <View style={styles.swapContainer}>
          <Pressable style={[styles.swapBtn, { backgroundColor: colors.primary }]} onPress={handleSwap}>
            <Feather name="arrow-down" size={20} color="#fff" />
          </Pressable>
          <Text style={[styles.rateText, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
            1 {fromCurrency.code} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {toCurrency.code}
          </Text>
        </View>

        <View style={[styles.convertCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>To</Text>
          <View style={styles.currencyRow}>
            <View style={[styles.currencyBadge, { backgroundColor: colors.accentMuted }]}>
              <Text style={[styles.currencyCode, { color: colors.accent, fontFamily: 'DMSans_700Bold' }]}>{toCurrency.code}</Text>
            </View>
            <Text style={[styles.convertedAmount, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>
              {convertedAmount > 0 ? convertedAmount.toFixed(2) : '0.00'}
            </Text>
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.btn, { backgroundColor: amount && parseFloat(amount) > 0 ? colors.primary : colors.card, opacity: pressed ? 0.9 : 1 }]}
          onPress={handleConvert} disabled={!amount || parseFloat(amount) <= 0 || loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.btnText, { color: amount && parseFloat(amount) > 0 ? '#fff' : colors.textTertiary, fontFamily: 'DMSans_600SemiBold' }]}>Convert</Text>}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 17 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  convertCard: { borderRadius: 18, padding: 20 },
  label: { fontSize: 13, marginBottom: 12 },
  currencyRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  currencyBadge: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  currencyCode: { fontSize: 15 },
  amountField: { flex: 1, fontSize: 28, textAlign: 'right' },
  convertedAmount: { flex: 1, fontSize: 28, textAlign: 'right' },
  swapContainer: { alignItems: 'center', paddingVertical: 12, gap: 6 },
  swapBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rateText: { fontSize: 12 },
  btn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  btnText: { fontSize: 16 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, marginBottom: 10 },
  successDesc: { fontSize: 15, textAlign: 'center', marginBottom: 40 },
});
