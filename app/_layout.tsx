import { QueryClientProvider } from "@tanstack/react-query";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import {
  useFonts,
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from "@expo-google-fonts/dm-sans";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ThemeProvider, useTheme } from "@/lib/theme-context";
import { ToastProvider } from "@/lib/toast-context";
import { StatusBar } from "expo-status-bar";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const { scheme } = useTheme();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === "(auth)";
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <>
      <StatusBar
        style={scheme === "dark" ? "light" : "dark"}
        backgroundColor={scheme === "dark" ? "#0A0E17" : "#F5F7FA"}
        translucent={false}
      />
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="transaction-detail"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="account-detail"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="invoice-detail"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="send-money"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="add-money"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="convert-money"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="earn"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="accounting"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="personal-info"
          options={{ headerShown: false, presentation: "modal" }}
        />
        <Stack.Screen
          name="card-settings"
          options={{ headerShown: false, presentation: "modal" }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView>
          <KeyboardProvider>
            <ThemeProvider>
              <AuthProvider>
                <ToastProvider>
                  <RootLayoutNav />
                </ToastProvider>
              </AuthProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
