import React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/context/AuthContext";
import { CartProvider } from "./src/context/CartContext";
import { useAuth } from "./src/hooks/useAuth";
import { useSplashTimer } from "./src/hooks/useSplashTimer";
import SplashScreen from "./src/screens/SplashScreen";
import AuthNavigator from "./src/navigation/AuthNavigator";
import TabMenu from "./src/navigation/TabMenu";
import { COLORS } from "./src/utils/theme";

function RootNavigator() {
  const { isAuthenticated, isBooting } = useAuth();
  const showSplash = useSplashTimer(isBooting);

  if (showSplash) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  return (
    <NavigationContainer>
      <TabMenu />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <AuthProvider>
          <CartProvider>
            <RootNavigator />
            <StatusBar style="light" backgroundColor={COLORS.void} />
          </CartProvider>
        </AuthProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.void,
  },
});
