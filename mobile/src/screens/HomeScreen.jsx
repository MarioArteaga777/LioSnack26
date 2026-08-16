import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/Buttons/CustomButton";
import { useAuth } from "../hooks/useAuth";
import { COLORS } from "../utils/theme";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const fullName = `${user?.name || "Astronauta"} ${user?.lastName || ""}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✦ PANEL DE USUARIO ✦</Text>
        </View>

        <Text style={styles.title}>LioSnack</Text>
        <Text style={styles.welcome}>¡Hola, {fullName}!</Text>
        <Text style={styles.caption}>
          Explora nuestro catálogo cósmico de snacks liofilizados 100% naturales.
        </Text>

        <View style={styles.actions}>
          <View style={styles.buttonWrapper}>
            <CustomButton
              textButton="Ver Productos"
              actionButton={() => navigation?.navigate?.("Products")}
            />
          </View>

          <View style={styles.logoutContainer}>
            <CustomButton textButton="Cerrar sesión" actionButton={logout} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.void,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "rgba(245, 168, 202, 0.12)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(245, 168, 202, 0.3)",
    marginBottom: 16,
  },
  badgeText: {
    color: COLORS.bloom,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  title: {
    color: COLORS.stardust,
    fontSize: 34,
    fontWeight: "800",
  },
  welcome: {
    marginTop: 10,
    color: COLORS.bloom,
    fontSize: 22,
    fontWeight: "700",
  },
  caption: {
    marginTop: 8,
    color: COLORS.mist,
    fontSize: 15,
    lineHeight: 22,
  },
  actions: {
    marginTop: 32,
    gap: 16,
  },
  buttonWrapper: {
    maxWidth: 220,
  },
  logoutContainer: {
    maxWidth: 220,
  },
});
