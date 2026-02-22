import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, useColorScheme, Platform, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useThemeColors } from '@/constants/colors';
import { cards, formatCurrency } from '@/lib/mock-data';

function CardVisual({ card, isActive, onPress }: { card: typeof cards[0]; isActive: boolean; onPress: () => void }) {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onPress();
        }}
        style={({ pressed }) => [
          styles.cardVisual,
          {
            backgroundColor: card.frozen ? colors.cardElevated : card.color,
            borderWidth: isActive ? 2 : 0,
            borderColor: isActive ? '#fff' : 'transparent',
            opacity: card.frozen ? 0.6 : (pressed ? 0.9 : 1),
          },
        ]}
      >
        <View style={styles.cardTop}>
          <Text style={[styles.cardName, { fontFamily: 'DMSans_600SemiBold' }]}>{card.name}</Text>
          {card.frozen && (
            <View style={styles.frozenBadge}>
              <Feather name="lock" size={12} color="#fff" />
              <Text style={[styles.frozenText, { fontFamily: 'DMSans_500Medium' }]}>Frozen</Text>
            </View>
          )}
        </View>
        <View style={styles.cardChip}>
          <MaterialCommunityIcons name="integrated-circuit-chip" size={30} color="rgba(255,255,255,0.7)" />
        </View>
        <Text style={[styles.cardNumber, { fontFamily: 'DMSans_500Medium' }]}>
          {'****  ****  ****  '}{card.last4}
        </Text>
        <View style={styles.cardBottom}>
          <View>
            <Text style={[styles.cardLabel, { fontFamily: 'DMSans_400Regular' }]}>VALID THRU</Text>
            <Text style={[styles.cardExpiry, { fontFamily: 'DMSans_600SemiBold' }]}>{card.expiry}</Text>
          </View>
          <Text style={[styles.cardType, { fontFamily: 'DMSans_700Bold' }]}>{card.type === 'visa' ? 'VISA' : 'MC'}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function CardsScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const [activeCardId, setActiveCardId] = useState(cards[0].id);
  const [cardsState, setCardsState] = useState(cards);
  const webTop = Platform.OS === 'web' ? 67 : 0;
  const webBottom = Platform.OS === 'web' ? 84 : 0;

  const activeCard = cardsState.find(c => c.id === activeCardId) || cardsState[0];

  const toggleFreeze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCardsState(prev => prev.map(c => c.id === activeCardId ? { ...c, frozen: !c.frozen } : c));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: insets.top + 16 + webTop, paddingBottom: 100 + webBottom }}>
        <Text style={[styles.pageTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Cards</Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cardsRow}>
          {cardsState.map(card => (
            <CardVisual key={card.id} card={card} isActive={card.id === activeCardId} onPress={() => setActiveCardId(card.id)} />
          ))}
        </ScrollView>

        <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.detailTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Card Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Card Number</Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>**** **** **** {activeCard.last4}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Expiry</Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{activeCard.expiry}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Available Balance</Text>
            <Text style={[styles.detailValue, { color: colors.primary, fontFamily: 'DMSans_600SemiBold' }]}>{formatCurrency(activeCard.balance, activeCard.currency)}</Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Network</Text>
            <Text style={[styles.detailValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{activeCard.type === 'visa' ? 'Visa' : 'Mastercard'}</Text>
          </View>
        </View>

        <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.detailTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Quick Actions</Text>
          <Pressable style={styles.actionRow} onPress={toggleFreeze}>
            <View style={[styles.actionIcon, { backgroundColor: activeCard.frozen ? colors.primaryMuted : colors.warningMuted }]}>
              <Feather name={activeCard.frozen ? 'unlock' : 'lock'} size={18} color={activeCard.frozen ? colors.primary : colors.warning} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{activeCard.frozen ? 'Unfreeze Card' : 'Freeze Card'}</Text>
            <Switch
              value={activeCard.frozen}
              onValueChange={toggleFreeze}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable style={styles.actionRow} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accentMuted }]}>
              <Feather name="settings" size={18} color={colors.accent} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Card Settings</Text>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable style={styles.actionRow} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}>
            <View style={[styles.actionIcon, { backgroundColor: colors.errorMuted }]}>
              <Feather name="trash-2" size={18} color={colors.error} />
            </View>
            <Text style={[styles.actionLabel, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>Cancel Card</Text>
            <Feather name="chevron-right" size={18} color={colors.textTertiary} />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  pageTitle: { fontSize: 28, paddingHorizontal: 20, marginBottom: 20 },
  cardsRow: { paddingHorizontal: 20, gap: 16, marginBottom: 28 },
  cardVisual: { width: 300, height: 188, borderRadius: 20, padding: 22, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardName: { color: '#fff', fontSize: 15 },
  frozenBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  frozenText: { color: '#fff', fontSize: 11 },
  cardChip: { marginVertical: 2 },
  cardNumber: { color: 'rgba(255,255,255,0.85)', fontSize: 16, letterSpacing: 2 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cardLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 9, marginBottom: 2 },
  cardExpiry: { color: '#fff', fontSize: 13 },
  cardType: { color: '#fff', fontSize: 20 },
  detailCard: { marginHorizontal: 20, borderRadius: 18, padding: 20, marginBottom: 16 },
  detailTitle: { fontSize: 16, marginBottom: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13 },
  divider: { height: 1, marginVertical: 8 },
  actionsCard: { marginHorizontal: 20, borderRadius: 18, padding: 20 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  actionIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { flex: 1, fontSize: 14 },
});
