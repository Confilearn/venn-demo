import React, { createContext, useContext, useState, useMemo, ReactNode, useCallback, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withDelay, runOnJS } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const hideToast = useCallback(() => {
    opacity.value = withTiming(0, { duration: 200 });
    translateY.value = withTiming(-20, { duration: 200 });
    setTimeout(() => setToast(null), 250);
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast({ message, type });
    opacity.value = withTiming(1, { duration: 250 });
    translateY.value = withTiming(0, { duration: 250 });
    timerRef.current = setTimeout(hideToast, 2500);
  }, [hideToast]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  const iconName = toast?.type === 'success' ? 'check-circle' : toast?.type === 'error' ? 'alert-circle' : 'info';
  const iconColor = toast?.type === 'success' ? '#00D09C' : toast?.type === 'error' ? '#FF4757' : '#4C7CFF';

  const value = useMemo(() => ({ showToast }), [showToast]);
  const webTop = Platform.OS === 'web' ? 67 : 0;

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <Animated.View style={[styles.toast, animStyle, { top: insets.top + 12 + webTop }]}>
          <View style={styles.toastContent}>
            <Feather name={iconName as any} size={18} color={iconColor} />
            <Text style={[styles.toastText, { fontFamily: 'DMSans_500Medium' }]}>{toast.message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#1C2333',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
});
