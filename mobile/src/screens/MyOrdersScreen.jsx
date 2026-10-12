import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getMyOrders } from "../services/orderService";
import { COLORS } from "../utils/theme";

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Fecha pendiente";
  return date.toLocaleDateString("es-SV", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPrice(value) {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError("");
    try {
      setOrders(await getMyOrders());
    } catch (loadError) {
      setError(loadError.message || "No pudimos cargar tus pedidos.");
    } finally {
      isRefresh ? setRefreshing(false) : setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const renderOrder = ({ item: order }) => (
    <View style={styles.order}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>PEDIDO #{String(order._id).slice(-8).toUpperCase()}</Text>
          <Text style={styles.date}>{formatDate(order.fecha_pedido || order.createdAt)}</Text>
        </View>
        <View style={styles.orderMeta}>
          <Text style={styles.status}>{order.estado_pedido || "Pendiente"}</Text>
          <Text style={styles.total}>{formatPrice(order.total_pedido)}</Text>
        </View>
      </View>

      {(order.items || []).map((product, index) => (
        <View key={`${product.sku || product.producto}-${index}`} style={styles.itemRow}>
          <Text style={styles.itemName}>
            {product.cantidad_solicitada || 1} × {product.producto || "Producto"}
          </Text>
          <Text style={styles.itemPrice}>
            {formatPrice((product.cantidad_solicitada || 1) * (product.precio_unitario || 0))}
          </Text>
        </View>
      ))}

      {!!order.direccion_entrega && (
        <Text style={styles.address}>Entrega: {order.direccion_entrega}</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.openDrawer()} hitSlop={8} style={styles.menuButton}>
          <Text style={styles.menuText}>☰</Text>
        </Pressable>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Mis pedidos</Text>
          <Text style={styles.subtitle}>Tus compras y su estado</Text>
        </View>
        <Pressable onPress={() => loadOrders(true)} disabled={loading} hitSlop={8}>
          <Text style={styles.refresh}>Actualizar</Text>
        </Pressable>
      </View>

      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => loadOrders()} style={styles.retryButton}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={orders}
        keyExtractor={(order) => order._id}
        renderItem={renderOrder}
        contentContainerStyle={orders.length ? styles.list : styles.emptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrders(true)}
            tintColor={COLORS.bloom}
            colors={[COLORS.bloom]}
          />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyState}>
              <ActivityIndicator size="large" color={COLORS.bloom} />
              <Text style={styles.emptyText}>Cargando pedidos...</Text>
            </View>
          ) : !error ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Aún no tienes pedidos</Text>
              <Text style={styles.emptyText}>Tus compras aparecerán aquí.</Text>
              <Pressable onPress={() => navigation.navigate("Products")} style={styles.shopButton}>
                <Text style={styles.shopButtonText}>Ver productos</Text>
              </Pressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.void, paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.nebulaBorder,
  },
  menuButton: { minWidth: 36, alignItems: "center" },
  menuText: { color: COLORS.stardust, fontSize: 24, fontWeight: "700" },
  titleGroup: { flex: 1 },
  title: { color: COLORS.stardust, fontSize: 22, fontWeight: "800" },
  subtitle: { color: COLORS.mist, fontSize: 12, marginTop: 2 },
  refresh: { color: COLORS.teal, fontSize: 12, fontWeight: "700" },
  list: { paddingVertical: 8, paddingBottom: 28 },
  emptyList: { flexGrow: 1, justifyContent: "center" },
  order: {
    marginTop: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.nebulaBorder,
    backgroundColor: COLORS.voidSoft,
  },
  orderHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12 },
  orderId: { color: COLORS.mistDim, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  date: { color: COLORS.stardust, fontSize: 13, fontWeight: "600", marginTop: 5 },
  orderMeta: { alignItems: "flex-end" },
  status: { color: COLORS.teal, fontSize: 11, fontWeight: "700" },
  total: { color: COLORS.stardust, fontSize: 17, fontWeight: "800", marginTop: 5 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 13,
  },
  itemName: { flex: 1, color: COLORS.mist, fontSize: 13 },
  itemPrice: { color: COLORS.stardust, fontSize: 13, fontWeight: "600" },
  address: { color: COLORS.mistDim, fontSize: 11, marginTop: 12 },
  emptyState: { alignItems: "center", padding: 24 },
  emptyTitle: { color: COLORS.stardust, fontSize: 17, fontWeight: "700" },
  emptyText: { color: COLORS.mist, fontSize: 13, textAlign: "center", marginTop: 8 },
  shopButton: {
    minHeight: 42,
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: COLORS.bloom,
  },
  shopButtonText: { color: COLORS.bloomInk, fontWeight: "700" },
  errorBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 143, 110, 0.35)",
    backgroundColor: COLORS.coralBg,
  },
  errorText: { color: COLORS.coral, fontSize: 13, textAlign: "center" },
  retryButton: { alignSelf: "center", padding: 8 },
  retryText: { color: COLORS.stardust, fontWeight: "700" },
});