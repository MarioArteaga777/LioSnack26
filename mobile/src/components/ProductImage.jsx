import { Image, StyleSheet, Text, View } from 'react-native';

export default function ProductImage({ uri, small = false }) {
  const sizeStyle = small ? styles.small : styles.large;
  return uri ? <Image source={{ uri }} style={[styles.image, sizeStyle]} resizeMode="cover" /> : (
    <View style={[styles.placeholder, sizeStyle]}><Text style={styles.placeholderText}>🍓</Text></View>
  );
}

const styles = StyleSheet.create({
  image: { borderRadius: 12, backgroundColor: '#F2E4D5' },
  placeholder: { alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: '#F2E4D5' },
  large: { width: 92, height: 92 },
  small: { width: 70, height: 70 },
  placeholderText: { fontSize: 31 },
});
