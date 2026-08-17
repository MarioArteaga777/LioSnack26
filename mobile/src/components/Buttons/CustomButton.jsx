import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLORS } from "../../utils/theme";

export default function Buttons({
  textButton,
  actionButton,
  disabled = false,
  variant = "primary", // "primary" | "secondary" | "danger"
}) {
  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryButton;
      case "danger":
        return styles.dangerButton;
      default:
        return styles.primaryButton;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return styles.secondaryText;
      case "danger":
        return styles.dangerText;
      default:
        return styles.primaryText;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, getButtonStyle(), disabled && styles.buttonDisabled]}
      onPress={actionButton}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.baseText, getTextStyle()]}>{textButton}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginTop: 10,
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: COLORS.bloom,
    shadowColor: COLORS.bloom,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: COLORS.nebulaLight,
    borderWidth: 1,
    borderColor: COLORS.nebulaBorder,
  },
  dangerButton: {
    backgroundColor: COLORS.coralBg,
    borderWidth: 1,
    borderColor: "rgba(255, 143, 110, 0.4)",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  baseText: {
    fontSize: 15,
    fontWeight: "700",
  },
  primaryText: {
    color: COLORS.bloomInk,
  },
  secondaryText: {
    color: COLORS.stardust,
  },
  dangerText: {
    color: COLORS.coral,
  },
});
