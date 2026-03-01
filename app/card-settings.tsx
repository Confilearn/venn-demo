import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useTheme } from '@/lib/theme-context';
import { useToast } from '@/lib/toast-context';
import { cards } from '@/lib/mock-data';

export default function CardSettingsScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const webTop = Platform.OS === 'web' ? 67 : 0;

  const [settings, setSettings] = useState({
    onlinePayments: true,
    internationalTransactions: true,
    contactlessPayments: true,
    atmWithdrawals: true,
    dailySpendingLimit: 5000,
    monthlySpendingLimit: 15000,
    autoLock: false,
    transactionNotifications: true,
    securityAlerts: true,
    monthlyStatements: true,
  });

  const handleToggle = (key: string, value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSettings(prev => ({ ...prev, [key]: value }));
    showToast(`${key.replace(/([A-Z])/g, ' $1').trim()} ${value ? 'enabled' : 'disabled'}`, 'success');
  };

  const handleLimitChange = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setSettings(prev => ({ ...prev, [key]: numValue }));
  };

  const handleFreezeCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Freeze Card', 'Are you sure you want to freeze this card? You can unfreeze it at any time.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Freeze', 
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showToast('Card frozen successfully', 'success');
          router.back();
        }
      },
    ]);
  };

  const handleReportLost = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Report Lost Card', 'Are you sure? This will permanently block your card and a new one will be issued.', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Report Lost', 
        style: 'destructive',
        onPress: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          showToast('New card being issued', 'success');
          router.back();
        }
      },
    ]);
  };

  const activeCard = cards[0]; // Using first card as example

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Card Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.cardPreview, { backgroundColor: activeCard.color }]}>
          <Text style={[styles.cardName, { fontFamily: 'DMSans_600SemiBold' }]}>{activeCard.name}</Text>
          <Text style={[styles.cardNumber, { fontFamily: 'DMSans_500Medium' }]}>**** **** **** {activeCard.last4}</Text>
          <Text style={[styles.cardExpiry, { fontFamily: 'DMSans_600SemiBold' }]}>{activeCard.expiry}</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Spending Controls</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Online Payments</Text>
            <Switch
              value={settings.onlinePayments}
              onValueChange={(value) => handleToggle('onlinePayments', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>International Transactions</Text>
            <Switch
              value={settings.internationalTransactions}
              onValueChange={(value) => handleToggle('internationalTransactions', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Contactless Payments</Text>
            <Switch
              value={settings.contactlessPayments}
              onValueChange={(value) => handleToggle('contactlessPayments', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>ATM Withdrawals</Text>
            <Switch
              value={settings.atmWithdrawals}
              onValueChange={(value) => handleToggle('atmWithdrawals', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Spending Limits</Text>
          
          <View style={styles.limitRow}>
            <Text style={[styles.limitLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Daily Limit</Text>
            <Text style={[styles.limitValue, { color: colors.primary, fontFamily: 'DMSans_600SemiBold' }]}>
              ${settings.dailySpendingLimit.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.limitRow}>
            <Text style={[styles.limitLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Monthly Limit</Text>
            <Text style={[styles.limitValue, { color: colors.primary, fontFamily: 'DMSans_600SemiBold' }]}>
              ${settings.monthlySpendingLimit.toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Security</Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Auto-Lock After Inactivity</Text>
            <Switch
              value={settings.autoLock}
              onValueChange={(value) => handleToggle('autoLock', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Transaction Notifications</Text>
            <Switch
              value={settings.transactionNotifications}
              onValueChange={(value) => handleToggle('transactionNotifications', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Security Alerts</Text>
            <Switch
              value={settings.securityAlerts}
              onValueChange={(value) => handleToggle('securityAlerts', value)}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Card Actions</Text>
          
          <Pressable style={[styles.actionBtn, { backgroundColor: colors.warningMuted }]} onPress={handleFreezeCard}>
            <Feather name="lock" size={18} color={colors.warning} />
            <Text style={[styles.actionText, { color: colors.warning, fontFamily: 'DMSans_600SemiBold' }]}>Freeze Card</Text>
          </Pressable>

          <Pressable style={[styles.actionBtn, { backgroundColor: colors.errorMuted }]} onPress={handleReportLost}>
            <Feather name="alert-triangle" size={18} color={colors.error} />
            <Text style={[styles.actionText, { color: colors.error, fontFamily: 'DMSans_600SemiBold' }]}>Report Lost/Stolen</Text>
          </Pressable>
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
  cardPreview: { borderRadius: 18, padding: 24, marginBottom: 20, alignItems: 'center' },
  cardName: { color: '#fff', fontSize: 16, marginBottom: 8 },
  cardNumber: { color: 'rgba(255,255,255,0.8)', fontSize: 18, marginBottom: 4 },
  cardExpiry: { color: 'rgba(255,255,255,0.6)', fontSize: 14 },
  section: { borderRadius: 18, padding: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, marginBottom: 16 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  settingLabel: { fontSize: 14, flex: 1 },
  divider: { height: 1, marginVertical: 8 },
  limitRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  limitLabel: { fontSize: 14 },
  limitValue: { fontSize: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 14, marginBottom: 8 },
  actionText: { fontSize: 15 },
});
