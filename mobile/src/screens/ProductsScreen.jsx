import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import ProductCard from '../components/ProductCard';
import useCart from '../hooks/useCart';
import { getProducts } from '../services/productsService';

export default function ProductsScreen({ onOpenCart }) {
  const { addItem, totals } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [addingId, setAddingId] = useState(null);

  const loadProducts = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try { setProducts(await getProducts()); } catch (loadError) { setError(loadError.message); } finally { isRefresh ? setRefreshing(false) : setLoading(false); }
  }, []);
  useEffect(() => { loadProducts(); }, [loadProducts]);

  const handleAdd = (product) => {
    setAddingId(product.id); const result = addItem(product); setNotice(result.message); setTimeout(() => setNotice(''), 2200); setAddingId(null);
  };
  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#D3543C" /><Text style={styles.stateText}>Cargando productos…</Text></View>;
  if (error) return <View style={styles.center}><Text style={styles.errorTitle}>No pudimos cargar los productos</Text><Text style={styles.stateText}>{error}</Text><Pressable onPress={() => loadProducts()} style={styles.retry}><Text style={styles.retryText}>Reintentar</Text></Pressable></View>;
  return <View style={styles.container}>
    <View style={styles.header}><View><Text style={styles.title}>Productos</Text><Text style={styles.subtitle}>Elige tus favoritos</Text></View><Pressable onPress={onOpenCart} style={styles.cartButton}><Text style={styles.cartText}>Carrito ({totals.quantity})</Text></Pressable></View>
    {!!notice && <View style={styles.notice}><Text style={styles.noticeText}>{notice}</Text></View>}
    <FlatList data={products} keyExtractor={(item) => item.id} renderItem={({ item }) => <ProductCard product={item} onAdd={handleAdd} disabled={addingId === item.id} />} contentContainerStyle={products.length ? styles.list : styles.emptyList} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProducts(true)} colors={['#D3543C']} />} ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyTitle}>No hay productos disponibles</Text><Text style={styles.stateText}>Vuelve a intentarlo más tarde.</Text></View>} />
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, backgroundColor: '#FFF8F1' }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 }, title: { fontSize: 28, fontWeight: '800', color: '#3E2520' }, subtitle: { color: '#725F58', marginTop: 2 }, cartButton: { backgroundColor: '#3E2520', paddingHorizontal: 12, minHeight: 42, justifyContent: 'center', borderRadius: 10 }, cartText: { color: '#FFF', fontWeight: '700' }, list: { paddingBottom: 24 }, emptyList: { flexGrow: 1, justifyContent: 'center' }, center: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F1' }, stateText: { marginTop: 8, color: '#725F58', textAlign: 'center' }, errorTitle: { color: '#A33A31', fontWeight: '800', fontSize: 18 }, retry: { marginTop: 18, paddingHorizontal: 20, minHeight: 42, justifyContent: 'center', borderRadius: 10, backgroundColor: '#D3543C' }, retryText: { color: '#FFF', fontWeight: '700' }, notice: { marginBottom: 10, padding: 11, backgroundColor: '#E0F2E7', borderRadius: 10 }, noticeText: { color: '#27633E', fontWeight: '600', textAlign: 'center' }, empty: { alignItems: 'center', padding: 24 }, emptyTitle: { fontSize: 18, fontWeight: '700', color: '#3E2520' },
});
