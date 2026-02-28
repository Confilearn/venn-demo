import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.6;

const currencies = [
  { code: "USD", name: "US Dollar", rate: 1.0, symbol: "$" },
  { code: "CAD", name: "Canadian Dollar", rate: 1.36, symbol: "C$" },
  { code: "EUR", name: "Euro", rate: 0.92, symbol: "€" },
  { code: "GBP", name: "British Pound", rate: 0.79, symbol: "£" },
];

interface CurrencyModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (currency: (typeof currencies)[0]) => void;
  title: string;
}

export default function CurrencyModal({
  visible,
  onClose,
  onSelect,
  title,
}: CurrencyModalProps) {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();

  const translateY = React.useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const panY = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > MODAL_HEIGHT * 0.3 || gestureState.vy > 1.5) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.spring(translateY, {
        toValue: MODAL_HEIGHT,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible]);

  const handleCurrencySelect = (currency: (typeof currencies)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSelect(currency);
    onClose();
  };

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: colors.background,
            transform: [
              { translateY },
              { translateY: Animated.add(translateY, panY) },
            ],
            paddingBottom: insets.bottom,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Handle Bar */}
        <View style={styles.handleBar}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            {title}
          </Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={24} color={colors.text} />
          </Pressable>
        </View>

        {/* Currency List */}
        <View style={styles.currencyList}>
          {currencies.map((currency) => (
            <Pressable
              key={currency.code}
              style={({ pressed }) => [
                styles.currencyItem,
                {
                  backgroundColor: colors.card,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() => handleCurrencySelect(currency)}
            >
              <View style={styles.currencyInfo}>
                <View
                  style={[
                    styles.currencyIcon,
                    { backgroundColor: colors.primaryMuted },
                  ]}
                >
                  <Text
                    style={[
                      styles.currencySymbol,
                      { color: colors.primary, fontFamily: "DMSans_700Bold" },
                    ]}
                  >
                    {currency.symbol}
                  </Text>
                </View>
                <View style={styles.currencyDetails}>
                  <Text
                    style={[
                      styles.currencyCode,
                      { color: colors.text, fontFamily: "DMSans_600SemiBold" },
                    ]}
                  >
                    {currency.code}
                  </Text>
                  <Text
                    style={[
                      styles.currencyName,
                      {
                        color: colors.textSecondary,
                        fontFamily: "DMSans_400Regular",
                      },
                    ]}
                  >
                    {currency.name}
                  </Text>
                </View>
              </View>
              <Text
                style={[
                  styles.exchangeRate,
                  {
                    color: colors.textTertiary,
                    fontFamily: "DMSans_400Regular",
                  },
                ]}
              >
                1 USD = {currency.rate.toFixed(4)} {currency.code}
              </Text>
            </Pressable>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  handleBar: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: 18,
  },
  currencyList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  currencyInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  currencyIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  currencySymbol: {
    fontSize: 20,
  },
  currencyDetails: {
    flex: 1,
  },
  currencyCode: {
    fontSize: 16,
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 13,
  },
  exchangeRate: {
    fontSize: 12,
    fontFamily: "DMSans_400Regular",
  },
});
