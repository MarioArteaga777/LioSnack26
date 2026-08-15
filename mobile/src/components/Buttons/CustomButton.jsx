import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Buttons({
  textButton,
  actionButton,
  disabled = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={actionButton}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{textButton}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#C26D3B",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 12,
    minWidth: 120,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
});
