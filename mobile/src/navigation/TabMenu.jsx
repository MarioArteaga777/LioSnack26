import { useState } from 'react';
import CartScreen from '../screens/CartScreen';
import ProductsScreen from '../screens/ProductsScreen';

// La aplicación aún no usa una librería de navegación; este flujo local evita añadir una dependencia innecesaria.
export default function TabMenu() {
  const [screen, setScreen] = useState('products');
  return screen === 'cart'
    ? <CartScreen onBack={() => setScreen('products')} />
    : <ProductsScreen onOpenCart={() => setScreen('cart')} />;
}
