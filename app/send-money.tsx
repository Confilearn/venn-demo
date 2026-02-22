import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, useColorScheme, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { beneficiaries, accounts, formatCurrency } from '@/lib/mock-data';

type Step = 'recipient' | 'amount' | 'confirm' | 'success';

export default function SendMoneyScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const webTop = Platform.OS === 'web' ? 67 : 0;

  const [step, setStep] = useState<Step>('recipient');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<typeof beneficiaries[0] | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const handleSelectRecipient = (b: typeof beneficiaries[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBeneficiary(b);
    setStep('amount');
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep('confirm');
  };

  const handleSend = async () => {
    setSending(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setStep('success');
  };

  const renderStep = () => {
    switch (step) {
      case 'recipient':
        return (
          <View>
            <Text style={[styles.stepTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Select Recipient</Text>
            <Text style={[styles.stepDesc, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Choose who to send money to</Text>
            <View style={styles.recipientList}>
              {beneficiaries.map(b => (
                <Pressable
                  key={b.id}
                  style={({ pressed }) => [styles.recipientItem, { backgroundColor: colors.card, opacity: pressed ? 0.8 : 1 }]}
                  onPress={() => handleSelectRecipient(b)}
                >
                  <View style={[styles.recipientAvatar, { backgroundColor: colors.accentMuted }]}>
                    <Text style={[styles.recipientInitials, { color: colors.accent, fontFamily: 'DMSans_700Bold' }]}>{b.avatar}</Text>
                  </View>
                  <View style={styles.recipientInfo}>
                    <Text style={[styles.recipientName, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{b.name}</Text>
                    <Text style={[styles.recipientBank, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>{b.bank} {b.accountNumber}</Text>
                  </View>
                  <Feather name="chevron-right" size={18} color={colors.textTertiary} />
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 'amount':
        return (
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.stepTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Enter Amount</Text>
              <Text style={[styles.stepDesc, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
                Sending to {selectedBeneficiary?.name}
              </Text>

              <View style={styles.amountInput}>
                <Text style={[styles.currencyPrefix, { color: colors.textTertiary, fontFamily: 'DMSans_700Bold' }]}>$</Text>
                <TextInput
                  style={[styles.amountField, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}
                  placeholder="0.00"
                  placeholderTextColor={colors.textTertiary}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>

              <Text style={[styles.availLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
                Available: {formatCurrency(accounts[0].balance, 'USD')}
              </Text>

              <View style={[styles.noteContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="edit-3" size={16} color={colors.textTertiary} />
                <TextInput
                  style={[styles.noteInput, { color: colors.text, fontFamily: 'DMSans_400Regular' }]}
                  placeholder="Add a note (optional)"
                  placeholderTextColor={colors.textTertiary}
                  value={note}
                  onChangeText={setNote}
                />
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.continueBtn,
                  { backgroundColor: amount && parseFloat(amount) > 0 ? colors.primary : colors.card, opacity: pressed ? 0.9 : 1 },
                ]}
                onPress={handleContinue}
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <Text style={[styles.continueBtnText, { color: amount && parseFloat(amount) > 0 ? '#fff' : colors.textTertiary, fontFamily: 'DMSans_600SemiBold' }]}>
                  Continue
                </Text>
              </Pressable>
            </View>
          </KeyboardAvoidingView>
        );

      case 'confirm':
        return (
          <View>
            <Text style={[styles.stepTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Confirm Transfer</Text>
            <View style={[styles.confirmCard, { backgroundColor: colors.card }]}>
              <View style={styles.confirmCenter}>
                <View style={[styles.confirmAvatar, { backgroundColor: colors.accentMuted }]}>
                  <Text style={[styles.confirmInitials, { color: colors.accent, fontFamily: 'DMSans_700Bold' }]}>{selectedBeneficiary?.avatar}</Text>
                </View>
                <Text style={[styles.confirmName, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>{selectedBeneficiary?.name}</Text>
                <Text style={[styles.confirmAmount, { color: colors.primary, fontFamily: 'DMSans_700Bold' }]}>{formatCurrency(parseFloat(amount))}</Text>
              </View>
              <View style={[styles.confirmDivider, { backgroundColor: colors.border }]} />
              <View style={styles.confirmRow}>
                <Text style={[styles.confirmLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>To</Text>
                <Text style={[styles.confirmValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{selectedBeneficiary?.bank} {selectedBeneficiary?.accountNumber}</Text>
              </View>
              <View style={styles.confirmRow}>
                <Text style={[styles.confirmLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>From</Text>
                <Text style={[styles.confirmValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>USD Account ****4521</Text>
              </View>
              {note ? (
                <View style={styles.confirmRow}>
                  <Text style={[styles.confirmLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Note</Text>
                  <Text style={[styles.confirmValue, { color: colors.text, fontFamily: 'DMSans_500Medium' }]}>{note}</Text>
                </View>
              ) : null}
              <View style={styles.confirmRow}>
                <Text style={[styles.confirmLabel, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Fee</Text>
                <Text style={[styles.confirmValue, { color: colors.success, fontFamily: 'DMSans_500Medium' }]}>Free</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [styles.sendBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}
              onPress={handleSend}
              disabled={sending}
            >
              {sending ? <ActivityIndicator color="#fff" /> : (
                <>
                  <Feather name="send" size={18} color="#fff" />
                  <Text style={[styles.sendBtnText, { fontFamily: 'DMSans_600SemiBold' }]}>Send {formatCurrency(parseFloat(amount))}</Text>
                </>
              )}
            </Pressable>
          </View>
        );

      case 'success':
        return (
          <View style={styles.successContainer}>
            <View style={[styles.successIcon, { backgroundColor: colors.primaryMuted }]}>
              <Feather name="check" size={40} color={colors.primary} />
            </View>
            <Text style={[styles.successTitle, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Transfer Sent</Text>
            <Text style={[styles.successDesc, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>
              {formatCurrency(parseFloat(amount))} has been sent to {selectedBeneficiary?.name}
            </Text>
            <Pressable
              style={({ pressed }) => [styles.doneBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.dismissAll(); }}
            >
              <Text style={[styles.doneBtnText, { fontFamily: 'DMSans_600SemiBold' }]}>Done</Text>
            </Pressable>
          </View>
        );
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 10 + webTop }]}>
        <Pressable onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          if (step === 'amount') setStep('recipient');
          else if (step === 'confirm') setStep('amount');
          else router.back();
        }} hitSlop={12}>
          <Feather name={step === 'recipient' || step === 'success' ? 'x' : 'arrow-left'} size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text, fontFamily: 'DMSans_600SemiBold' }]}>Send Money</Text>
        <View style={{ width: 24 }} />
      </View>

      {step !== 'success' && (
        <View style={styles.progress}>
          {[1, 2, 3].map(i => (
            <View key={i} style={[styles.progressDot, {
              backgroundColor: i <= (step === 'recipient' ? 1 : step === 'amount' ? 2 : 3) ? colors.primary : colors.border,
              flex: 1,
            }]} />
          ))}
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {renderStep()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 12 },
  headerTitle: { fontSize: 17 },
  progress: { flexDirection: 'row', gap: 6, paddingHorizontal: 20, marginBottom: 20 },
  progressDot: { height: 3, borderRadius: 2 },
  content: { paddingHorizontal: 20, paddingBottom: 40, flexGrow: 1 },
  stepTitle: { fontSize: 24, marginBottom: 6 },
  stepDesc: { fontSize: 14, marginBottom: 24 },
  recipientList: { gap: 8 },
  recipientItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, gap: 12 },
  recipientAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  recipientInitials: { fontSize: 16 },
  recipientInfo: { flex: 1 },
  recipientName: { fontSize: 15, marginBottom: 2 },
  recipientBank: { fontSize: 12 },
  amountInput: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 30 },
  currencyPrefix: { fontSize: 36, marginRight: 4 },
  amountField: { fontSize: 48, minWidth: 100, textAlign: 'center' },
  availLabel: { textAlign: 'center', fontSize: 13, marginBottom: 24 },
  noteContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, height: 48, marginBottom: 24 },
  noteInput: { flex: 1, fontSize: 14, height: '100%' },
  continueBtn: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  continueBtnText: { fontSize: 16 },
  confirmCard: { borderRadius: 18, padding: 24, marginBottom: 24 },
  confirmCenter: { alignItems: 'center', marginBottom: 20 },
  confirmAvatar: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  confirmInitials: { fontSize: 20 },
  confirmName: { fontSize: 16, marginBottom: 6 },
  confirmAmount: { fontSize: 32 },
  confirmDivider: { height: 1, marginBottom: 14 },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  confirmLabel: { fontSize: 13 },
  confirmValue: { fontSize: 13 },
  sendBtn: { flexDirection: 'row', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center', gap: 8 },
  sendBtnText: { color: '#fff', fontSize: 16 },
  successContainer: { alignItems: 'center', paddingTop: 60 },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, marginBottom: 10 },
  successDesc: { fontSize: 15, textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  doneBtn: { width: '100%', height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { color: '#fff', fontSize: 16 },
});
