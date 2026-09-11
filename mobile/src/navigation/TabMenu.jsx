import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProductsScreen from '../screens/ProductsScreen';
import HomeScreen from '../screens/HomeScreen';
import { COLORS } from '../utils/theme';

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

// Stack Navigator para el Carrito y Checkout
function CartStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="CartView" component={CartScreen} />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

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
        component={CartStackNavigator}
        options={{ drawerLabel: '🛒 Mi Carrito' }}
      />
    </Drawer.Navigator>
  );
}
