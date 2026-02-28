import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Platform,
  Switch,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { useToast } from "@/lib/toast-context";
import { cards, formatCurrency } from "@/lib/mock-data";

function CardVisual({
  card,
  isActive,
  onPress,
}: {
  card: (typeof cards)[0];
  isActive: boolean;
  onPress: () => void;
}) {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isFrozen = card.frozen;
  const textColor = isFrozen && scheme === "light" ? colors.text : "#fff";

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
            backgroundColor: isFrozen ? colors.cardElevated : card.color,
            borderWidth: isActive ? 2 : 0,
            borderColor: isActive ? "#fff" : "transparent",
            opacity: isFrozen ? 0.8 : pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.cardTop}>
          <Text
            style={[
              styles.cardName,
              { fontFamily: "DMSans_600SemiBold", color: textColor },
            ]}
          >
            {card.name}
          </Text>
          {isFrozen && (
            <View
              style={[
                styles.frozenBadge,
                {
                  backgroundColor:
                    scheme === "light"
                      ? "rgba(0,0,0,0.1)"
                      : "rgba(255,255,255,0.2)",
                },
              ]}
            >
              <Feather
                name="lock"
                size={12}
                color={scheme === "light" ? colors.text : "#fff"}
              />
              <Text
                style={[
                  styles.frozenText,
                  {
                    fontFamily: "DMSans_500Medium",
                    color: scheme === "light" ? colors.text : "#fff",
                  },
                ]}
              >
                Frozen
              </Text>
            </View>
          )}
        </View>
        <View style={styles.cardChip}>
          <MaterialCommunityIcons
            name="integrated-circuit-chip"
            size={30}
            color={
              isFrozen && scheme === "light"
                ? "rgba(26,29,38,0.5)"
                : "rgba(255,255,255,0.7)"
            }
          />
        </View>
        <Text
          style={[
            styles.cardNumber,
            { fontFamily: "DMSans_500Medium", color: textColor },
          ]}
        >
          {"****  ****  ****  "}
          {card.last4}
        </Text>
        <View style={styles.cardBottom}>
          <View>
            <Text
              style={[
                styles.cardLabel,
                {
                  fontFamily: "DMSans_400Regular",
                  color:
                    isFrozen && scheme === "light"
                      ? "rgba(26,29,38,0.5)"
                      : "rgba(255,255,255,0.5)",
                },
              ]}
            >
              VALID THRU
            </Text>
            <Text
              style={[
                styles.cardExpiry,
                { fontFamily: "DMSans_600SemiBold", color: textColor },
              ]}
            >
              {card.expiry}
            </Text>
          </View>
          <Text
            style={[
              styles.cardType,
              { fontFamily: "DMSans_700Bold", color: textColor },
            ]}
          >
            {card.type === "visa" ? "VISA" : "MC"}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default function CardsScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const [activeCardId, setActiveCardId] = useState(cards[0].id);
  const [cardsState, setCardsState] = useState(cards);
  const webTop = Platform.OS === "web" ? 67 : 0;
  const webBottom = Platform.OS === "web" ? 84 : 0;

  const activeCard =
    cardsState.find((c) => c.id === activeCardId) || cardsState[0];

  const toggleFreeze = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCardsState((prev) =>
      prev.map((c) =>
        c.id === activeCardId ? { ...c, frozen: !c.frozen } : c,
      ),
    );
  };

  const handleCopyCardDetails = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const cardDetails = `Card Number: **** **** **** ${activeCard.last4}\nExpiry: ${activeCard.expiry}\nName: ${activeCard.name}`;
    await Clipboard.setStringAsync(cardDetails);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast("Card details copied to clipboard! 🎉", "success");
  };

  const handleCancelCard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Cancel Card",
      `Are you sure you want to cancel your ${activeCard.name} card ending in ${activeCard.last4}? This action cannot be undone.`,
      [
        { text: "No, Keep Card", style: "cancel" },
        {
          text: "Yes, Cancel Card",
          style: "destructive",
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Remove the card from the list
            setCardsState((prev) => prev.filter((c) => c.id !== activeCardId));
            // If there are other cards, select the first one
            if (cardsState.length > 1) {
              const remainingCards = cardsState.filter(
                (c) => c.id !== activeCardId,
              );
              setActiveCardId(remainingCards[0].id);
            }
            showToast("Card cancelled successfully", "success");
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 16 + webTop,
          paddingBottom: 100 + webBottom,
        }}
      >
        <Text
          style={[
            styles.pageTitle,
            { color: colors.text, fontFamily: "DMSans_700Bold" },
          ]}
        >
          Cards
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
        >
          {cardsState.map((card) => (
            <CardVisual
              key={card.id}
              card={card}
              isActive={card.id === activeCardId}
              onPress={() => setActiveCardId(card.id)}
            />
          ))}
          <Pressable
            style={[styles.addCardBtn, { backgroundColor: colors.card }]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/create-card");
            }}
          >
            <View
              style={[
                styles.addCardIcon,
                { backgroundColor: colors.primaryMuted },
              ]}
            >
              <Feather name="plus" size={24} color={colors.primary} />
            </View>
            <Text
              style={[
                styles.addCardText,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Add New Card
            </Text>
          </Pressable>
        </ScrollView>

        <View style={[styles.detailCard, { backgroundColor: colors.card }]}>
          <View style={styles.detailHeader}>
            <Text
              style={[
                styles.detailTitle,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Card Details
            </Text>
            <Pressable onPress={handleCopyCardDetails} style={styles.copyBtn}>
              <Feather name="copy" size={16} color={colors.primary} />
            </Pressable>
          </View>
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Card Number
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.text, fontFamily: "DMSans_500Medium" },
              ]}
            >
              **** **** **** {activeCard.last4}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Expiry
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.text, fontFamily: "DMSans_500Medium" },
              ]}
            >
              {activeCard.expiry}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Available Balance
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.primary, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              {formatCurrency(activeCard.balance, activeCard.currency)}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                {
                  color: colors.textSecondary,
                  fontFamily: "DMSans_400Regular",
                },
              ]}
            >
              Network
            </Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.text, fontFamily: "DMSans_500Medium" },
              ]}
            >
              {activeCard.type === "visa" ? "Visa" : "Mastercard"}
            </Text>
          </View>
        </View>

        <View style={[styles.actionsCard, { backgroundColor: colors.card }]}>
          <Text
            style={[
              styles.detailTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Quick Actions
          </Text>
          <Pressable style={styles.actionRow} onPress={toggleFreeze}>
            <View
              style={[
                styles.actionIcon,
                {
                  backgroundColor: activeCard.frozen
                    ? colors.primaryMuted
                    : colors.warningMuted,
                },
              ]}
            >
              <Feather
                name={activeCard.frozen ? "unlock" : "lock"}
                size={18}
                color={activeCard.frozen ? colors.primary : colors.warning}
              />
            </View>
            <Text
              style={[
                styles.actionLabel,
                { color: colors.text, fontFamily: "DMSans_500Medium" },
              ]}
            >
              {activeCard.frozen ? "Unfreeze Card" : "Freeze Card"}
            </Text>
            <Switch
              value={activeCard.frozen}
              onValueChange={toggleFreeze}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#fff"
            />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable
            style={styles.actionRow}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/card-settings");
            }}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.accentMuted },
              ]}
            >
              <Feather name="settings" size={18} color={colors.accent} />
            </View>
            <Text
              style={[
                styles.actionLabel,
                { color: colors.text, fontFamily: "DMSans_500Medium" },
              ]}
            >
              Card Settings
            </Text>
            <Feather
              name="chevron-right"
              size={18}
              color={colors.textTertiary}
            />
          </Pressable>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Pressable style={styles.actionRow} onPress={handleCancelCard}>
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: colors.errorMuted },
              ]}
            >
              <Feather name="trash-2" size={18} color={colors.error} />
            </View>
            <Text
              style={[
                styles.actionLabel,
                { color: colors.text, fontFamily: "DMSans_500Medium" },
              ]}
            >
              Cancel Card
            </Text>
            <Feather
              name="chevron-right"
              size={18}
              color={colors.textTertiary}
            />
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
  addCardBtn: {
    width: 300,
    height: 188,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "rgba(0, 208, 156, 0.3)",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  addCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  addCardText: { fontSize: 16 },
  cardVisual: {
    width: 300,
    height: 188,
    borderRadius: 20,
    padding: 22,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: { color: "#fff", fontSize: 15 },
  frozenBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  frozenText: { color: "#fff", fontSize: 11 },
  cardChip: { marginVertical: 2 },
  cardNumber: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 16,
    letterSpacing: 2,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  cardLabel: { color: "rgba(255,255,255,0.5)", fontSize: 9, marginBottom: 2 },
  cardExpiry: { color: "#fff", fontSize: 13 },
  cardType: { color: "#fff", fontSize: 20 },
  detailCard: {
    marginHorizontal: 20,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailTitle: { fontSize: 16 },
  copyBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(0, 208, 156, 0.1)",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13 },
  divider: { height: 1, marginVertical: 8 },
  actionsCard: { marginHorizontal: 20, borderRadius: 18, padding: 20 },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 6,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { flex: 1, fontSize: 14 },
});
