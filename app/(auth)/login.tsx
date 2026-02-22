import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme, ActivityIndicator, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeColors } from '@/constants/colors';
import { useAuth } from '@/lib/auth-context';

export default function LoginScreen() {
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const webTop = Platform.OS === 'web' ? 67 : 0;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={[styles.container, { paddingTop: insets.top + 40 + webTop, paddingBottom: insets.bottom + 20 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primaryMuted }]}>
            <Feather name="shield" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text, fontFamily: 'DMSans_700Bold' }]}>Welcome to Venn</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Sign in to manage your finances</Text>
        </View>

        <View style={styles.form}>
          {!!error && (
            <View style={[styles.errorBox, { backgroundColor: colors.errorMuted }]}>
              <Feather name="alert-circle" size={16} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error, fontFamily: 'DMSans_500Medium' }]}>{error}</Text>
            </View>
          )}
          <View>
            <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>Email</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="mail" size={18} color={colors.textTertiary} />
              <TextInput
                style={[styles.input, { color: colors.text, fontFamily: 'DMSans_400Regular' }]}
                placeholder="name@company.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.textSecondary, fontFamily: 'DMSans_500Medium' }]}>Password</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.textTertiary} />
              <TextInput
                style={[styles.input, { color: colors.text, fontFamily: 'DMSans_400Regular' }]}
                placeholder="Enter your password"
                placeholderTextColor={colors.textTertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoComplete="password"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)} hitSlop={8}>
                <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color={colors.textTertiary} />
              </Pressable>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={[styles.buttonText, { fontFamily: 'DMSans_600SemiBold' }]}>Sign In</Text>}
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary, fontFamily: 'DMSans_400Regular' }]}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={[styles.footerLink, { color: colors.primary, fontFamily: 'DMSans_600SemiBold' }]}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoContainer: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 28, marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  form: { gap: 20, marginBottom: 32 },
  label: { fontSize: 13, marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 16, height: 52, gap: 12 },
  input: { flex: 1, fontSize: 15, height: '100%' },
  button: { height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10 },
  errorText: { fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  footerText: { fontSize: 14 },
  footerLink: { fontSize: 14 },
});
