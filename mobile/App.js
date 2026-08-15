import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CartProvider } from './src/context/CartContext';
import TabMenu from './src/navigation/TabMenu';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <CartProvider>
        <NavigationContainer>
          <TabMenu />
        </NavigationContainer>
        <StatusBar style="dark" />
      </CartProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF8F1',
  },
});
