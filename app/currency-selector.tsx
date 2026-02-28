import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useTheme } from '@/lib/theme-context';

const currencies = [
  { code: 'USD', name: 'US Dollar', rate: 1.0 },
  { code: 'CAD', name: 'Canadian Dollar', rate: 1.36 },
  { code: 'EUR', name: 'Euro', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', rate: 0.79 },
];

export default function CurrencySelectorScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const params = useLocalSearchParams<{ from: string }>();
  const isFrom = params.from === 'true';

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // Navigate back to convert screen with selected currency
    router.back();
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>
          Select Currency
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>
          {isFrom ? 'From Currency' : 'To Currency'}
        </Text>
        
        <View style={styles.currencyList}>
          {currencies.map((currency) => (
            <Pressable
              key={currency.code}
              style={({ pressed }) => [
                styles.currencyItem,
                { 
                  backgroundColor: colors.card,
                  opacity: pressed ? 0.8 : 1,
                  borderWidth: 2,
                  borderColor: colors.primary
                }
              ]}
              onPress={() => handleCurrencySelect(currency)}
            >
              <View style={styles.currencyInfo}>
                <Text style={[styles.currencyCode, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>
                  {currency.code}
                </Text>
                <Text style={[styles.currencyName, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>
                  {currency.name}
                </Text>
              </View>
              <View style={styles.rateInfo}>
                <Text style={[styles.rateLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
                  Rate
                </Text>
                <Text style={[styles.rateValue, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>
                  {currency.rate.toFixed(4)}
                </Text>
              </View>
            </Pressable>
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
  sectionTitle: { fontSize: 16, marginBottom: 20 },
  currencyList: { gap: 12 },
  currencyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 14,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currencyCode: {
    fontSize: 18,
    minWidth: 60,
  },
  currencyName: {
    fontSize: 14,
  },
  rateInfo: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rateLabel: {
    fontSize: 12,
  },
  rateValue: {
    fontSize: 14,
  },
});
