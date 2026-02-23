import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useTheme } from '@/lib/theme-context';
import { useToast } from '@/lib/toast-context';

const rewards = [
  { id: '1', title: 'Refer a Friend', desc: 'Earn $50 for each friend who signs up and makes a deposit', reward: '$50', icon: 'users', color: '#00D09C' },
  { id: '2', title: 'First Transfer Bonus', desc: 'Send your first international transfer and earn a bonus', reward: '$25', icon: 'send', color: '#4C7CFF' },
  { id: '3', title: 'Direct Deposit', desc: 'Set up direct deposit and earn a welcome bonus', reward: '$100', icon: 'briefcase', color: '#FF6B8A' },
  { id: '4', title: 'Card Spending Bonus', desc: 'Spend $500 with your Venn card in the first 30 days', reward: '$75', icon: 'credit-card', color: '#FFB020' },
  { id: '5', title: 'Invoice Cashback', desc: 'Receive payments via Venn invoices and earn 1% cashback', reward: '1%', icon: 'file-text', color: '#9B59B6' },
];

export default function EarnScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const [claimed, setClaimed] = useState<Set<string>>(new Set());

  const handleClaim = (id: string, title: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setClaimed(prev => new Set(prev).add(id));
    showToast(`${title} reward activated!`, 'success');
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.back(); }} hitSlop={12}>
          <Feather name="x" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Earn Rewards</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={[styles.bannerCard, { backgroundColor: colors.primary }]}>
          <Feather name="gift" size={32} color="#fff" />
          <View style={styles.bannerInfo}>
            <Text style={[styles.bannerTitle, { fontFamily: 'DMSans_700Bold' }]}>Earn up to $500</Text>
            <Text style={[styles.bannerDesc, { fontFamily: 'DMSans_400Regular' }]}>Complete tasks below to unlock rewards</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Available Rewards</Text>
        <View style={styles.rewardList}>
          {rewards.map(r => {
            const isClaimed = claimed.has(r.id);
            return (
              <View key={r.id} style={[styles.rewardItem, { backgroundColor: colors.card }]}>
                <View style={[styles.rewardIcon, { backgroundColor: r.color + '20' }]}>
                  <Feather name={r.icon as any} size={20} color={r.color} />
                </View>
                <View style={styles.rewardInfo}>
                  <Text style={[styles.rewardTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{r.title}</Text>
                  <Text style={[styles.rewardDesc, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{r.desc}</Text>
                </View>
                <View style={styles.rewardRight}>
                  <Text style={[styles.rewardAmount, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>{r.reward}</Text>
                  <Pressable
                    style={[styles.claimBtn, { backgroundColor: isClaimed ? colors.primaryMuted : colors.primary }]}
                    onPress={() => !isClaimed && handleClaim(r.id, r.title)}
                    disabled={isClaimed}
                  >
                    <Text style={[styles.claimText, { color: isClaimed ? colors.primary : '#fff', fontFamily: 'DMSans_600SemiBold' }]}>
                      {isClaimed ? 'Claimed' : 'Start'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
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
  bannerCard: { flexDirection: 'row', alignItems: 'center', gap: 16, borderRadius: 18, padding: 24, marginBottom: 24 },
  bannerInfo: { flex: 1 },
  bannerTitle: { color: '#fff', fontSize: 20, marginBottom: 4 },
  bannerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  sectionTitle: { fontSize: 17, marginBottom: 12 },
  rewardList: { gap: 10 },
  rewardItem: { flexDirection: 'row', padding: 16, borderRadius: 14, gap: 12 },
  rewardIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rewardInfo: { flex: 1 },
  rewardTitle: { fontSize: 14, marginBottom: 3 },
  rewardDesc: { fontSize: 12, lineHeight: 16 },
  rewardRight: { alignItems: 'flex-end', gap: 6 },
  rewardAmount: { fontSize: 16 },
  claimBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 8 },
  claimText: { fontSize: 12 },
});
