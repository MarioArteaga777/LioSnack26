import { Pressable, StyleSheet, Text, View } from 'react-native';
import ProductImage from './ProductImage';

const formatPrice = (price) => `$${price.toFixed(2)}`;

export default function ProductCard({ product, onAdd, disabled }) {
  const unavailable = product.stock === 0;
  return <View style={styles.card}>
    <ProductImage uri={product.image} />
    <View style={styles.details}>
      <Text style={styles.name}>{product.name}</Text>
      {!!product.description && <Text style={styles.description} numberOfLines={2}>{product.description}</Text>}
      <Text style={styles.price}>{formatPrice(product.price)}</Text>
      <Text style={[styles.stock, unavailable && styles.unavailable]}>
        {product.stock === null || product.stock === undefined ? 'Disponible' : unavailable ? 'Agotado' : `${product.stock} disponibles`}
      </Text>
      <Pressable disabled={disabled || unavailable} onPress={() => onAdd(product)} style={({ pressed }) => [styles.button, (disabled || unavailable) && styles.disabled, pressed && styles.pressed]}>
        <Text style={styles.buttonText}>{unavailable ? 'Agotado' : 'Agregar al carrito'}</Text>
      </Pressable>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, padding: 14, backgroundColor: '#FFF', borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#422', shadowOpacity: 0.08, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
  details: { flex: 1 }, name: { fontSize: 16, fontWeight: '700', color: '#3E2520' }, description: { marginTop: 3, color: '#725F58', fontSize: 13 }, price: { marginTop: 8, fontSize: 17, fontWeight: '800', color: '#D3543C' }, stock: { marginTop: 2, color: '#37734F', fontSize: 12, fontWeight: '600' }, unavailable: { color: '#A33A31' },
  button: { marginTop: 10, minHeight: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 10, backgroundColor: '#D3543C' }, buttonText: { color: '#FFF', fontWeight: '700' }, disabled: { backgroundColor: '#BDAFA8' }, pressed: { opacity: 0.8 },
});
