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
import { useAuth } from "../hooks/useAuth";
import { COLORS } from "../utils/theme";

export default function LoginScreen({ navigation, route }) {
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const justVerified = route?.params?.justVerified;

  const handleSubmit = async () => {
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Ingresa tu correo y contraseña.");
      return;
    }

    const result = await login({ email: email.trim(), password });
    if (!result.ok) {
      setError(result.message || "Error al iniciar sesión.");
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
            <Text style={styles.tagIcon}>🚀</Text>
            <Text style={styles.tagText}>INICIAR SESIÓN</Text>
          </View>

          {/* Titles */}
          <Text style={styles.title}>Bienvenido de vuelta</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para continuar con tu compra y pedidos espaciales.
          </Text>

          {/* Just Verified banner */}
          {justVerified && (
            <View style={styles.verifiedBanner}>
              <Text style={styles.verifiedText}>
                ✓ Cuenta verificada. Ahora puedes iniciar sesión.
              </Text>
            </View>
          )}

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
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Tu contraseña"
                  placeholderTextColor={COLORS.mistDim}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Text style={styles.eyeText}>{showPassword ? "👁️" : "🔒"}</Text>
                </Pressable>
              </View>
            </View>

            {/* Error message */}
            {!!error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            )}

            {/* Submit Button */}
            <Pressable
              onPress={handleSubmit}
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
                  <Text style={styles.submitButtonText}>Ingresando...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Iniciar sesión</Text>
              )}
            </Pressable>
          </View>

          {/* Footer link to Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Aún no tienes cuenta? </Text>
            <Pressable
              onPress={() => navigation.navigate("Register")}
              hitSlop={6}
            >
              <Text style={styles.footerLink}>Regístrate</Text>
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
    color: COLORS.bloom,
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
  verifiedBanner: {
    backgroundColor: COLORS.tealBg,
    borderColor: "rgba(99, 217, 196, 0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  verifiedText: {
    color: COLORS.teal,
    fontSize: 13,
    fontWeight: "600",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.nebula,
    borderWidth: 1,
    borderColor: COLORS.nebulaBorder,
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.stardust,
    fontSize: 15,
  },
  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  eyeText: {
    fontSize: 16,
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
    backgroundColor: COLORS.bloom,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: COLORS.bloom,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.bloomDark,
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
