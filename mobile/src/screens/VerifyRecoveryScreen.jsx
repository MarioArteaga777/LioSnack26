import React, { useEffect, useRef, useState } from "react";
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

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60; // segundos

export default function VerifyRecoveryScreen({ navigation, route }) {
  const { email } = route?.params || {};

  // Array de 6 dígitos
  const [digits, setDigits] = useState(Array(CODE_LENGTH).fill(""));
  const inputs = useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Temporizador de cooldown para reenvío
  useEffect(() => {
    if (cooldown <= 0) return;
    const id = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [cooldown]);

  const handleDigitChange = (text, index) => {
    // Solo dígitos
    const digit = text.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);
    setError("");

    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = digits.join("");
    if (code.length < CODE_LENGTH) {
      setError("Ingresa el código de 6 dígitos completo.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await authService.verifyRecoveryCode(code);
      navigation.navigate("NewPassword");
    } catch (err) {
      setError(err.message || "Código inválido o expirado.");
      setDigits(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResendLoading(true);
    setError("");
    try {
      await authService.requestRecoveryCode(email);
      setDigits(Array(CODE_LENGTH).fill(""));
      inputs.current[0]?.focus();
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.message || "Error al reenviar el código.");
    } finally {
      setResendLoading(false);
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
            <Text style={styles.tagIcon}>📩</Text>
            <Text style={styles.tagText}>VERIFICAR CÓDIGO</Text>
          </View>

          <Text style={styles.title}>Revisa tu correo</Text>
          <Text style={styles.subtitle}>
            Enviamos un código de 6 dígitos a{"\n"}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>

          {/* Code inputs */}
          <View style={styles.codeRow}>
            {digits.map((digit, i) => (
              <TextInput
                key={i}
                ref={(ref) => (inputs.current[i] = ref)}
                style={[styles.codeInput, digit ? styles.codeInputFilled : null]}
                value={digit}
                onChangeText={(text) => handleDigitChange(text, i)}
                onKeyPress={(e) => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!loading}
              />
            ))}
          </View>

          {/* Error */}
          {!!error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* Verify button */}
          <Pressable
            onPress={handleVerify}
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
              <Text style={styles.submitButtonText}>Verificar código</Text>
            )}
          </Pressable>

          {/* Resend */}
          <View style={styles.resendRow}>
            <Text style={styles.resendText}>¿No llegó el código? </Text>
            {resendLoading ? (
              <ActivityIndicator size="small" color={COLORS.bloom} />
            ) : cooldown > 0 ? (
              <Text style={styles.resendCooldown}>Reenviar en {cooldown}s</Text>
            ) : (
              <Pressable onPress={handleResend} hitSlop={6}>
                <Text style={styles.resendLink}>Reenviar</Text>
              </Pressable>
            )}
          </View>

          {/* Back */}
          <Pressable
            onPress={() => navigation.navigate("ForgotPassword")}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Cambiar correo</Text>
          </Pressable>
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
    color: COLORS.teal,
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
    lineHeight: 22,
    marginBottom: 24,
  },
  emailHighlight: {
    color: COLORS.teal,
    fontWeight: "600",
  },
  codeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: COLORS.nebula,
    borderWidth: 1.5,
    borderColor: COLORS.nebulaBorder,
    borderRadius: 14,
    textAlign: "center",
    color: COLORS.stardust,
    fontSize: 22,
    fontWeight: "700",
  },
  codeInputFilled: {
    borderColor: COLORS.teal,
    backgroundColor: "rgba(99, 217, 196, 0.08)",
  },
  errorContainer: {
    backgroundColor: COLORS.coralBg,
    borderColor: "rgba(255, 143, 110, 0.3)",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorText: {
    color: COLORS.coral,
    fontSize: 13,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: COLORS.teal,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.teal,
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
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  resendText: {
    color: COLORS.mist,
    fontSize: 13,
  },
  resendLink: {
    color: COLORS.bloom,
    fontSize: 13,
    fontWeight: "700",
  },
  resendCooldown: {
    color: COLORS.mistDim,
    fontSize: 13,
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
    marginTop: 14,
    paddingVertical: 4,
  },
  backText: {
    color: COLORS.mistDim,
    fontSize: 13,
  },
});
