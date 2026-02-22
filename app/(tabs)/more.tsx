import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useColorScheme, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';
import { invoices, formatCurrency } from '@/lib/mock-data';

function MenuItem({ icon, label, color, badge, onPress }: { icon: string; label: string; color: string; badge?: string; onPress: () => void }) {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  return (
    <Pressable style={({ pressed }) => [styles.menuItem, { opacity: pressed ? 0.7 : 1 }]} onPress={onPress}>
      <View style={[styles.menuIcon, { backgroundColor: color + '20' }]}>
        <Feather name={icon as any} size={18} color={color} />
      </View>
      <Text style={[styles.menuLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{label}</Text>
      <View style={styles.menuRight}>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.badgeText, { fontFamily: 'DMSans_600SemiBold' }]}>{badge}</Text>
          </View>
        )}
        <Feather name="chevron-right" size={16} color={colors.textTertiary} />
      </View>
    </Pressable>
  );
}

export default function MoreScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const webBottom = Platform.OS === 'web' ? 84 : 0;

  const unpaidCount = invoices.filter(i => i.status !== 'paid').length;

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await logout();
      }},
    ]);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 16 + webTop, paddingBottom: 100 + webBottom }}>
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>More</Text>

        <Pressable style={[styles.profileCard, { backgroundColor: colors.card }]} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
          <View style={[styles.profileAvatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.profileInitials, { fontFamily: 'DMSans_700Bold' }]}>{user?.avatar || 'U'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{user?.name || 'User'}</Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{user?.email || ''}</Text>
          </View>
          <Feather name="chevron-right" size={18} color={colors.textTertiary} />
        </Pressable>

        <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
          <MenuItem icon="file-text" label="Invoices" color={colors.accent} badge={String(unpaidCount)} onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push({ pathname: '/invoice-detail', params: { view: 'list' } });
          }} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="trending-up" label="Investments" color="#FF6B8A" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="dollar-sign" label="Loans" color={colors.warning} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="bar-chart-2" label="Accounting" color={colors.primary} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
        </View>

        <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
          <MenuItem icon="user" label="Personal Info" color={colors.accent} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="shield" label="Security" color={colors.primary} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="bell" label="Notifications" color={colors.warning} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon="help-circle" label="Help & Support" color={colors.textSecondary} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />
        </View>

        <Pressable style={[styles.logoutBtn, { backgroundColor: colors.errorMuted }]} onPress={handleLogout}>
          <Feather name="log-out" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error, fontFamily: 'DMSans_600SemiBold' }]}>Sign Out</Text>
        </Pressable>

        <Text style={[styles.version, { color: colors.textTertiary, fontFamily: 'DMSans_400Regular' }]}>Venn v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  pageTitle: { fontSize: 28, paddingHorizontal: 20, marginBottom: 20 },
  profileCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, borderRadius: 18, padding: 16, marginBottom: 24, gap: 14 },
  profileAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  profileInitials: { color: '#fff', fontSize: 18 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, marginBottom: 2 },
  profileEmail: { fontSize: 13 },
  menuSection: { marginHorizontal: 20, borderRadius: 18, padding: 4, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  menuIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 15 },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 11 },
  divider: { height: 1, marginHorizontal: 14 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 20, borderRadius: 14, padding: 16, gap: 8, marginBottom: 16 },
  logoutText: { fontSize: 15 },
  version: { textAlign: 'center', fontSize: 12, marginBottom: 20 },
});
