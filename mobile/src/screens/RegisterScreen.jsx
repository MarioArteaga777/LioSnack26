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

export default function RegisterScreen({ navigation }) {
  const { register, verifyCode, resendCode, loading } = useAuth();

  const [step, setStep] = useState("form"); // "form" | "verify"
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegisterSubmit = async () => {
    setError("");
    setInfo("");

    if (
      !form.name.trim() ||
      !form.lastName.trim() ||
      !form.email.trim() ||
      !form.password
    ) {
      setError("Completa todos los campos para continuar.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Ingresa un correo electrónico válido (ejemplo@gmail.com).");
      return;
    }

    if (form.password.length < 7) {
      setError("La contraseña debe tener al menos 7 caracteres.");
      return;
    }

    const hasSymbol = /[^a-zA-Z0-9]/.test(form.password);
    if (!hasSymbol) {
      setError("La contraseña debe contener al menos un signo o carácter especial (ej. !, @, #, $, etc.).");
      return;
    }

    const result = await register(form);
    if (!result.ok) {
      setError(result.message || "Error al crear la cuenta.");
      return;
    }

    setInfo(result.message || "Código enviado a tu correo electrónico.");
    setStep("verify");
  };

  const handleVerifySubmit = async () => {
    setError("");
    setInfo("");

    if (!code.trim()) {
      setError("Ingresa el código que enviamos a tu correo.");
      return;
    }

    const result = await verifyCode({ email: form.email, code: code.trim() });
    if (!result.ok) {
      setError(result.message || "Código inválido o expirado.");
      return;
    }

    // Navegamos al login indicando que fue verificado
    navigation.navigate("Login", { justVerified: true });
  };

  const handleResend = async () => {
    setError("");
    const result = await resendCode(form.email);
    setInfo(result.message || "Código reenviado con éxito.");
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
            <Text style={styles.tagIcon}>{step === "form" ? "🚀" : "🛡️"}</Text>
            <Text style={styles.tagText}>
              {step === "form" ? "CREAR CUENTA" : "VERIFICA TU CORREO"}
            </Text>
          </View>

          {step === "form" ? (
            <>
              {/* Form Header */}
              <Text style={styles.title}>Únete a la tripulación</Text>
              <Text style={styles.subtitle}>
                Crea tu cuenta para guardar tus pedidos espaciales y avanzar más rápido.
              </Text>

              {/* Form Fields */}
              <View style={styles.form}>
                <View style={styles.rowFields}>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      value={form.name}
                      onChangeText={(val) => handleChange("name", val)}
                      placeholder="Tu nombre"
                      placeholderTextColor={COLORS.mistDim}
                    />
                  </View>
                  <View style={[styles.fieldGroup, { flex: 1 }]}>
                    <Text style={styles.label}>Apellido</Text>
                    <TextInput
                      style={styles.input}
                      value={form.lastName}
                      onChangeText={(val) => handleChange("lastName", val)}
                      placeholder="Tu apellido"
                      placeholderTextColor={COLORS.mistDim}
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Correo electrónico</Text>
                  <TextInput
                    style={styles.input}
                    value={form.email}
                    onChangeText={(val) => handleChange("email", val)}
                    placeholder="ejemplo@gmail.com"
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
                      value={form.password}
                      onChangeText={(val) => handleChange("password", val)}
                      placeholder="Mínimo 6 caracteres"
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

                {/* Error / Info messages */}
                {!!error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠ {error}</Text>
                  </View>
                )}

                {/* Submit button */}
                <Pressable
                  onPress={handleRegisterSubmit}
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
                      <Text style={styles.submitButtonText}>Creando cuenta...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Crear cuenta</Text>
                  )}
                </Pressable>
              </View>

              {/* Footer link to Login */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                <Pressable
                  onPress={() => navigation.navigate("Login")}
                  hitSlop={6}
                >
                  <Text style={styles.footerLink}>Inicia sesión</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              {/* Verify Step Header */}
              <Text style={styles.title}>Revisa tu correo</Text>
              <Text style={styles.subtitle}>
                Enviamos un código de 6 dígitos a{" "}
                <Text style={{ color: COLORS.stardust, fontWeight: "700" }}>
                  {form.email}
                </Text>
                . Expira en 15 minutos.
              </Text>

              {/* Verification Form */}
              <View style={styles.form}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Código de verificación</Text>
                  <TextInput
                    style={[styles.input, styles.codeInput]}
                    value={code}
                    onChangeText={setCode}
                    placeholder="123456"
                    placeholderTextColor={COLORS.mistDim}
                    keyboardType="number-pad"
                    maxLength={6}
                  />
                </View>

                {/* Error / Info messages */}
                {!!error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>⚠ {error}</Text>
                  </View>
                )}
                {!!info && !error && (
                  <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>✓ {info}</Text>
                  </View>
                )}

                {/* Verify Button */}
                <Pressable
                  onPress={handleVerifySubmit}
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
                      <Text style={styles.submitButtonText}>Verificando...</Text>
                    </View>
                  ) : (
                    <Text style={styles.submitButtonText}>Verificar cuenta</Text>
                  )}
                </Pressable>

                {/* Resend button */}
                <Pressable
                  onPress={handleResend}
                  style={styles.resendButton}
                  hitSlop={8}
                >
                  <Text style={styles.resendText}>Reenviar código</Text>
                </Pressable>

                {/* Back to edit info */}
                <Pressable
                  onPress={() => setStep("form")}
                  style={styles.resendButton}
                  hitSlop={8}
                >
                  <Text style={styles.backText}>← Modificar mis datos</Text>
                </Pressable>
              </View>

              {/* Footer link to Login */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
                <Pressable
                  onPress={() => navigation.navigate("Login")}
                  hitSlop={6}
                >
                  <Text style={styles.footerLink}>Inicia sesión</Text>
                </Pressable>
              </View>
            </>
          )}
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
  form: {
    gap: 16,
  },
  rowFields: {
    flexDirection: "row",
    gap: 12,
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
  codeInput: {
    textAlign: "center",
    fontSize: 22,
    letterSpacing: 6,
    fontWeight: "700",
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
  infoContainer: {
    backgroundColor: COLORS.tealBg,
    borderColor: "rgba(99, 217, 196, 0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
  },
  infoText: {
    color: COLORS.teal,
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
  resendButton: {
    alignItems: "center",
    paddingVertical: 6,
  },
  resendText: {
    color: COLORS.mist,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  backText: {
    color: COLORS.mistDim,
    fontSize: 12,
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
