import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useThemeColors } from "@/constants/colors";
import { useTheme } from "@/lib/theme-context";
import { useToast } from "@/lib/toast-context";
import { cards } from "@/lib/mock-data";
import { Stack } from "expo-router";

const cardTypes = [
  { id: "visa", name: "Visa", color: "#1A1F71" },
  { id: "mastercard", name: "Mastercard", color: "#EB001B" },
];

export default function CreateCardScreen() {
  const { scheme } = useTheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { showToast } = useToast();
  const webTop = Platform.OS === "web" ? 67 : 0;

  const [cardName, setCardName] = useState("");
  const [selectedType, setSelectedType] = useState(cardTypes[0]);
  const [loading, setLoading] = useState(false);

  const handleCreateCard = async () => {
    if (!cardName.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showToast("Please enter a card name", "error");
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Simulate card creation
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    showToast("Card created successfully!", "success");

    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Feather name="x" size={24} color={colors.text} />
          </Pressable>
          <Text
            style={[
              styles.headerTitle,
              { color: colors.text, fontFamily: "DMSans_600SemiBold" },
            ]}
          >
            Create New Card
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View
            style={[
              styles.cardPreview,
              { backgroundColor: selectedType.color, marginTop: 26 },
            ]}
          >
            <View style={styles.chipContainer}>
              <View style={styles.chip} />
            </View>
            <Text
              style={[styles.cardNumber, { fontFamily: "DMSans_600SemiBold" }]}
            >
              ••••• •••• ••••
            </Text>
            <Text
              style={[styles.cardHolder, { fontFamily: "DMSans_500Medium" }]}
            >
              {cardName || "YOUR NAME"}
            </Text>
            <View style={styles.cardBottom}>
              <Text
                style={[styles.cardLabel, { fontFamily: "DMSans_400Regular" }]}
              >
                VALID THRU
              </Text>
              <Text
                style={[
                  styles.cardExpiry,
                  { fontFamily: "DMSans_600SemiBold" },
                ]}
              >
                12/28
              </Text>
            </View>
          </View>

          <View
            style={[
              styles.formCard,
              { backgroundColor: colors.card, marginTop: 16 },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text, fontFamily: "DMSans_600SemiBold" },
              ]}
            >
              Card Details
            </Text>

            <View style={styles.inputGroup}>
              <Text
                style={[
                  styles.label,
                  {
                    color: colors.textSecondary,
                    fontFamily: "DMSans_500Medium",
                  },
                ]}
              >
                Card Name
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Enter card name"
                placeholderTextColor={colors.textTertiary}
                value={cardName}
                onChangeText={setCardName}
                maxLength={30}
              />
            </View>

            <Text
              style={[
                styles.label,
                { color: colors.textSecondary, fontFamily: "DMSans_500Medium" },
              ]}
            >
              Card Type
            </Text>
            <View style={styles.cardTypes}>
              {cardTypes.map((type) => (
                <Pressable
                  key={type.id}
                  style={[
                    styles.cardTypeOption,
                    {
                      backgroundColor:
                        selectedType.id === type.id
                          ? colors.primary
                          : colors.surface,
                      borderColor:
                        selectedType.id === type.id
                          ? colors.primary
                          : colors.border,
                    },
                  ]}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedType(type);
                  }}
                >
                  <Text
                    style={[
                      styles.cardTypeText,
                      {
                        color:
                          selectedType.id === type.id ? "#fff" : colors.text,
                        fontFamily: "DMSans_600SemiBold",
                      },
                    ]}
                  >
                    {type.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.createBtn,
              {
                backgroundColor: cardName.trim() ? colors.primary : colors.card,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={handleCreateCard}
            disabled={!cardName.trim() || loading}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <View style={styles.spinner} />
              </View>
            ) : (
              <Text
                style={[
                  styles.createBtnText,
                  {
                    color: cardName.trim() ? "#fff" : colors.textTertiary,
                    fontFamily: "DMSans_600SemiBold",
                  },
                ]}
              >
                Create Card
              </Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 17 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  cardPreview: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
    marginBottom: 24,
  },
  chipContainer: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  chip: {
    width: 40,
    height: 30,
    borderRadius: 6,
    backgroundColor: "#FFD700",
  },
  cardNumber: {
    fontSize: 18,
    letterSpacing: 3,
    color: "rgba(255,255,255,0.8)",
    marginTop: 40,
  },
  cardHolder: {
    fontSize: 14,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.6)",
    marginTop: 8,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: "auto",
  },
  cardLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.5)",
  },
  cardExpiry: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  formCard: {
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  cardTypes: {
    flexDirection: "row",
    gap: 12,
  },
  cardTypeOption: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
  },
  cardTypeText: {
    fontSize: 14,
  },
  createBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 24,
  },
  createBtnText: {
    fontSize: 16,
  },
  loadingContainer: {
    width: 20,
    height: 20,
  },
  spinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    transform: [{ rotate: "45deg" }],
  },
});
