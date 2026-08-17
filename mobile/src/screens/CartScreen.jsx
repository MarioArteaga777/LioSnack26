import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ProductImage from "../components/ProductImage";
import useCart from "../hooks/useCart";

const formatPrice = (price) => `$${price.toFixed(2)}`;

export default function CartScreen({ navigation }) {
  const { items, totals, updateQuantity, removeItem } = useCart();
  const changeQuantity = (item, next) => {
    const result = updateQuantity(item.id, next);
    if (!result.ok) Alert.alert("Carrito", result.message);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.navigate('Products')} hitSlop={8}>
          <Text style={styles.back}>‹ Productos</Text>
        </Pressable>
        <Text style={styles.title}>Mi carrito</Text>
        <View style={styles.spacer} />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={items.length ? styles.list : styles.emptyList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ProductImage uri={item.image} small />
            <View style={styles.details}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.unitPrice}>
                {formatPrice(item.price)} c/u
              </Text>
              <Text style={styles.subtotal}>
                Subtotal: {formatPrice(item.price * item.quantity)}
              </Text>
              <View style={styles.controls}>
                <Pressable
                  onPress={() => changeQuantity(item, item.quantity - 1)}
                  style={styles.control}
                >
                  <Text style={styles.controlText}>−</Text>
                </Pressable>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <Pressable
                  onPress={() => changeQuantity(item, item.quantity + 1)}
                  style={styles.control}
                >
                  <Text style={styles.controlText}>+</Text>
                </Pressable>
                <Pressable
                  onPress={() => removeItem(item.id)}
                  style={styles.remove}
                >
                  <Text style={styles.removeText}>Eliminar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
            <Text style={styles.emptyText}>
              Agrega productos para verlos aquí.
            </Text>
            <Pressable onPress={() => navigation.navigate('Products')} style={styles.explore}>
              <Text style={styles.exploreText}>Ver productos</Text>
            </Pressable>
          </View>
        }
        ListFooterComponent={
          items.length ? (
            <View style={styles.totals}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Productos</Text>
                <Text>{totals.quantity}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(totals.subtotal)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.grandLabel}>Total</Text>
                <Text style={styles.grandTotal}>
                  {formatPrice(totals.subtotal)}
                </Text>
              </View>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: "#FFF8F1" },
  header: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  back: { color: "#D3543C", fontWeight: "700", fontSize: 15 },
  title: { fontSize: 21, fontWeight: "800", color: "#3E2520" },
  spacer: { width: 76 },
  list: { paddingBottom: 25 },
  emptyList: { flexGrow: 1, justifyContent: "center" },
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 13,
    marginBottom: 12,
    backgroundColor: "#FFF",
    borderRadius: 16,
    elevation: 2,
    shadowColor: "#422",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  details: { flex: 1 },
  name: { color: "#3E2520", fontWeight: "700", fontSize: 16 },
  unitPrice: { color: "#725F58", marginTop: 3 },
  subtotal: { color: "#D3543C", marginTop: 5, fontWeight: "700" },
  controls: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  control: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    backgroundColor: "#F2E4D5",
  },
  controlText: { color: "#3E2520", fontSize: 22, fontWeight: "700" },
  quantity: {
    minWidth: 34,
    textAlign: "center",
    fontWeight: "700",
    color: "#3E2520",
  },
  remove: { marginLeft: "auto", minHeight: 36, justifyContent: "center" },
  removeText: { color: "#A33A31", fontWeight: "700" },
  totals: {
    padding: 16,
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginTop: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  totalLabel: { color: "#725F58" },
  totalValue: { color: "#3E2520", fontWeight: "700" },
  divider: { height: 1, backgroundColor: "#F0E2D8", marginVertical: 10 },
  grandLabel: { fontSize: 18, fontWeight: "800", color: "#3E2520" },
  grandTotal: { fontSize: 20, fontWeight: "800", color: "#D3543C" },
  empty: { alignItems: "center", padding: 24 },
  emptyIcon: { fontSize: 42 },
  emptyTitle: {
    marginTop: 8,
    fontSize: 19,
    fontWeight: "800",
    color: "#3E2520",
  },
  emptyText: { marginTop: 6, textAlign: "center", color: "#725F58" },
  explore: {
    marginTop: 18,
    paddingHorizontal: 18,
    minHeight: 42,
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#D3543C",
  },
  exploreText: { color: "#FFF", fontWeight: "700" },
});
