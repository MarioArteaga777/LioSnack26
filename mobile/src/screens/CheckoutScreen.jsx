import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import useCart from "../hooks/useCart";
import useAuth from "../hooks/useAuth";
import { processPaymentWithWompi, formatAmountToWompi } from "../services/paymentService";

const formatPrice = (price) => `$${price.toFixed(2)}`;

export default function CheckoutScreen({ navigation }) {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, phone, cardNumber, expiryMonth, expiryYear, cvv } = formData;

    if (!fullName?.trim()) {
      Alert.alert("Error", "Por favor ingresa tu nombre completo");
      return false;
    }
    if (!email?.trim() || !email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un email válido");
      return false;
    }
    if (!phone?.trim()) {
      Alert.alert("Error", "Por favor ingresa tu teléfono");
      return false;
    }
    if (!cardNumber?.trim() || cardNumber.length < 13) {
      Alert.alert("Error", "Número de tarjeta inválido");
      return false;
    }
    if (!expiryMonth || !expiryYear) {
      Alert.alert("Error", "Vencimiento de tarjeta inválido");
      return false;
    }
    if (!cvv || cvv.length < 3) {
      Alert.alert("Error", "CVV inválido");
      return false;
    }
    if (items.length === 0) {
      Alert.alert("Error", "Tu carrito está vacío");
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // En un caso real, aquí enviarías los datos a tu backend para tokenizar la tarjeta con Wompi
      // Por ahora, simularemos un pago de prueba
      
      const paymentData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        amount: formatAmountToWompi(totals.subtotal),
        description: `Compra de ${items.length} producto(s) - LioSnack`,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          subtotal: item.price * item.quantity,
        })),
        // En producción, el token se generaría desde el frontend usando la librería de Wompi
        cardToken: null, // Placeholder
        cardLast4: formData.cardNumber.slice(-4),
      };

      // Llamar al servicio de pago
      const response = await processPaymentWithWompi(paymentData);

      if (response.ok || response.success) {
        Alert.alert(
          "¡Éxito!",
          "Tu pago ha sido procesado correctamente.",
          [
            {
              text: "Continuar",
              onPress: () => {
                clearCart();
                navigation.replace("Home");
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Error",
          response.message || "Ocurrió un error al procesar el pago",
        );
      }
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo procesar el pago");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>

        <Text style={styles.title}>Detalles del Pago</Text>

        {/* Resumen del Carrito */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen de tu compra</Text>
          <View style={styles.summaryBox}>
            {items.map((item) => (
              <View key={item.id} style={styles.summaryItem}>
                <Text style={styles.itemName}>
                  {item.quantity}x {item.name}
                </Text>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total a pagar</Text>
              <Text style={styles.totalValue}>
                {formatPrice(totals.subtotal)}
              </Text>
            </View>
          </View>
        </View>

        {/* Datos Personales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos personales</Text>
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            value={formData.fullName}
            onChangeText={(value) => handleInputChange("fullName", value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Teléfono"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            editable={!loading}
          />
        </View>

        {/* Datos de Tarjeta */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la tarjeta</Text>
          <Text style={styles.note}>
            🔒 Tu información de pago es segura y encriptada
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Número de tarjeta"
            keyboardType="number-pad"
            maxLength={19}
            value={formData.cardNumber}
            onChangeText={(value) => {
              const cleaned = value.replace(/\s/g, "");
              const formatted = cleaned
                .match(/.{1,4}/g)
                ?.join(" ")
                .substring(0, 19) || cleaned;
              handleInputChange("cardNumber", formatted);
            }}
            editable={!loading}
          />
          <TextInput
            style={styles.input}
            placeholder="Nombre en la tarjeta"
            value={formData.cardName}
            onChangeText={(value) => handleInputChange("cardName", value)}
            editable={!loading}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              placeholder="MM"
              keyboardType="number-pad"
              maxLength={2}
              value={formData.expiryMonth}
              onChangeText={(value) => handleInputChange("expiryMonth", value)}
              editable={!loading}
            />
            <Text style={styles.separator}>/</Text>
            <TextInput
              style={[styles.input, styles.inputSmall]}
              placeholder="YY"
              keyboardType="number-pad"
              maxLength={2}
              value={formData.expiryYear}
              onChangeText={(value) => handleInputChange("expiryYear", value)}
              editable={!loading}
            />
            <TextInput
              style={[styles.input, styles.inputSmall]}
              placeholder="CVV"
              keyboardType="number-pad"
              maxLength={4}
              value={formData.cvv}
              onChangeText={(value) => handleInputChange("cvv", value)}
              editable={!loading}
              secureTextEntry
            />
          </View>
        </View>

        {/* Botón de Pago */}
        <Pressable
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={loading}
        >
          <Text style={styles.payButtonText}>
            {loading ? "Procesando..." : `Pagar ${formatPrice(totals.subtotal)}`}
          </Text>
        </Pressable>

        <Text style={styles.disclaimer}>
          Al completar esta compra, aceptas nuestros términos y condiciones.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F1",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  back: {
    color: "#D3543C",
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3E2520",
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3E2520",
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#422",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemName: {
    flex: 1,
    color: "#3E2520",
    fontWeight: "600",
  },
  itemPrice: {
    color: "#D3543C",
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#F0E2D8",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3E2520",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#D3543C",
  },
  input: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8D4C4",
    color: "#3E2520",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  inputSmall: {
    flex: 1,
    marginBottom: 0,
  },
  separator: {
    fontSize: 18,
    fontWeight: "700",
    color: "#725F58",
  },
  note: {
    fontSize: 13,
    color: "#725F58",
    marginBottom: 12,
    fontStyle: "italic",
  },
  payButton: {
    minHeight: 48,
    borderRadius: 10,
    backgroundColor: "#D3543C",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  payButtonDisabled: {
    opacity: 0.6,
  },
  payButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  disclaimer: {
    fontSize: 12,
    color: "#725F58",
    textAlign: "center",
    marginTop: 16,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3E2520",
    marginTop: 12,
  },
});
