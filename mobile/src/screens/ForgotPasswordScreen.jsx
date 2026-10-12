import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { authService } from "../services/authService";
import { COLORS } from "../utils/theme";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    setError("");
    const trimmed = email.trim();

    if (!trimmed) {
      setError("Ingresa tu correo electrónico.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError("Ingresa un correo válido.");
      return;
    }

    setLoading(true);
    try {
      await authService.requestRecoveryCode(trimmed);
      navigation.navigate("VerifyRecovery", { email: trimmed });
    } catch (err) {
      setError(err.message || "Error al enviar el código.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {/* Header Tag */}
          <View style={styles.tagWrapper}>
            <Text style={styles.tagIcon}>🔑</Text>
            <Text style={styles.tagText}>RECUPERAR CONTRASEÑA</Text>
          </View>

          {/* Titles */}
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>
            Ingresa tu correo y te enviaremos un código de 6 dígitos para
            restablecer tu contraseña.
          </Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="ejemplo@correo.com"
                placeholderTextColor={COLORS.mistDim}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
            </View>

            {/* Error */}
            {!!error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            )}

            {/* Submit */}
            <Pressable
              onPress={handleSend}
              disabled={loading}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                loading && styles.submitButtonDisabled,
              ]}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator size="small" color={COLORS.bloomInk} />
                  <Text style={styles.submitButtonText}>Enviando código...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Enviar código</Text>
              )}
            </Pressable>
          </View>

          {/* Back to login */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Recordaste tu contraseña? </Text>
            <Pressable onPress={() => navigation.navigate("Login")} hitSlop={6}>
              <Text style={styles.footerLink}>Inicia sesión</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.void,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: COLORS.voidSoft,
    borderWidth: 1,
    borderColor: COLORS.nebulaBorder,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  tagWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tagIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tagText: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.stardust,
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.mist,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: COLORS.mist,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    backgroundColor: COLORS.nebula,
    borderWidth: 1,
    borderColor: COLORS.nebulaBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.stardust,
    fontSize: 15,
  },
  errorContainer: {
    backgroundColor: COLORS.coralBg,
    borderColor: "rgba(255, 143, 110, 0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  errorText: {
    color: COLORS.coral,
    fontSize: 13,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonPressed: {
    opacity: 0.85,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.bloomInk,
    fontSize: 15,
    fontWeight: "700",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: COLORS.mist,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.bloom,
    fontSize: 14,
    fontWeight: "700",
  },
});
