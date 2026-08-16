import { createDrawerNavigator } from '@react-navigation/drawer';
import CartScreen from '../screens/CartScreen';
import ProductsScreen from '../screens/ProductsScreen';
import HomeScreen from '../screens/HomeScreen';
import { COLORS } from '../utils/theme';

const Drawer = createDrawerNavigator();

export default function TabMenu() {
  return (
    <Drawer.Navigator
      initialRouteName="Products"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: COLORS.voidSoft,
          width: 250,
          borderRightWidth: 1,
          borderRightColor: COLORS.nebulaBorder,
        },
        drawerActiveTintColor: COLORS.bloom,
        drawerInactiveTintColor: COLORS.mist,
        drawerActiveBackgroundColor: COLORS.nebulaLight,
        drawerLabelStyle: {
          fontWeight: '700',
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ drawerLabel: '✦ Inicio' }}
      />
      <Drawer.Screen
        name="Products"
        component={ProductsScreen}
        options={{ drawerLabel: '🪐 Productos' }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{ drawerLabel: '🛒 Mi Carrito' }}
      />
    </Drawer.Navigator>
  );
}
