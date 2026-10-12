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

const PASSWORD_MIN_LENGTH = 6;

/** Valida que la contraseña cumpla los requisitos mínimos */
function validatePassword(pwd) {
  if (pwd.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }
  return null;
}

export default function NewPasswordScreen({ navigation }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!newPassword || !confirmPassword) {
      setError("Completa ambos campos.");
      return;
    }
    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await authService.setNewPassword(newPassword, confirmPassword);
      navigation.navigate("Login", { passwordReset: true });
    } catch (err) {
      setError(err.message || "Error al actualizar la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  const strengthLevel = (() => {
    if (!newPassword) return 0;
    let score = 0;
    if (newPassword.length >= 6) score++;
    if (newPassword.length >= 10) score++;
    if (/[A-Z]/.test(newPassword)) score++;
    if (/\d/.test(newPassword)) score++;
    if (/[^A-Za-z0-9]/.test(newPassword)) score++;
    return score;
  })();

  const strengthLabel = ["", "Muy débil", "Débil", "Regular", "Buena", "Fuerte"][strengthLevel];
  const strengthColor = [
    "transparent",
    COLORS.coral,
    "#F5A350",
    COLORS.gold,
    COLORS.teal,
    COLORS.bloom,
  ][strengthLevel];

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
            <Text style={styles.tagIcon}>🔐</Text>
            <Text style={styles.tagText}>NUEVA CONTRASEÑA</Text>
          </View>

          <Text style={styles.title}>Crea tu nueva contraseña</Text>
          <Text style={styles.subtitle}>
            Elige una contraseña segura que no hayas usado antes.
          </Text>

          <View style={styles.form}>
            {/* Nueva contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={COLORS.mistDim}
                  secureTextEntry={!showNew}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowNew(!showNew)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Text style={styles.eyeText}>{showNew ? "👁️" : "🔒"}</Text>
                </Pressable>
              </View>

              {/* Barra de fortaleza */}
              {newPassword.length > 0 && (
                <View style={styles.strengthRow}>
                  <View style={styles.strengthBars}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <View
                        key={level}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor:
                              level <= strengthLevel ? strengthColor : COLORS.nebulaBorder,
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthLabel, { color: strengthColor }]}>
                    {strengthLabel}
                  </Text>
                </View>
              )}
            </View>

            {/* Confirmar contraseña */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repite la contraseña"
                  placeholderTextColor={COLORS.mistDim}
                  secureTextEntry={!showConfirm}
                  autoCapitalize="none"
                  editable={!loading}
                />
                <Pressable
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={styles.eyeButton}
                  hitSlop={8}
                >
                  <Text style={styles.eyeText}>{showConfirm ? "👁️" : "🔒"}</Text>
                </Pressable>
              </View>

              {/* Match indicator */}
              {confirmPassword.length > 0 && (
                <Text
                  style={[
                    styles.matchText,
                    {
                      color:
                        newPassword === confirmPassword ? COLORS.teal : COLORS.coral,
                    },
                  ]}
                >
                  {newPassword === confirmPassword
                    ? "✓ Las contraseñas coinciden"
                    : "✗ Las contraseñas no coinciden"}
                </Text>
              )}
            </View>

            {/* Error */}
            {!!error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠ {error}</Text>
              </View>
            )}

            {/* Submit */}
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
                  <Text style={styles.submitButtonText}>Actualizando...</Text>
                </View>
              ) : (
                <Text style={styles.submitButtonText}>Cambiar contraseña</Text>
              )}
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
  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  strengthBars: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    width: 60,
    textAlign: "right",
  },
  matchText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
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
});
