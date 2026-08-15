import { createDrawerNavigator } from '@react-navigation/drawer';
import CartScreen from '../screens/CartScreen';
import ProductsScreen from '../screens/ProductsScreen';
import HomeScreen from '../screens/HomeScreen';

const Drawer = createDrawerNavigator();

export default function TabMenu() {
  return (
    <Drawer.Navigator
      initialRouteName="Products"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFF8F1',
          width: 240,
        },
        drawerActiveTintColor: '#D3543C',
        drawerInactiveTintColor: '#3E2520',
        drawerActiveBackgroundColor: '#F2E4D5',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ drawerLabel: 'Inicio' }}
      />
      <Drawer.Screen
        name="Products"
        component={ProductsScreen}
        options={{ drawerLabel: 'Productos' }}
      />
      <Drawer.Screen
        name="Cart"
        component={CartScreen}
        options={{ drawerLabel: 'Mi Carrito' }}
      />
    </Drawer.Navigator>
  );
}
