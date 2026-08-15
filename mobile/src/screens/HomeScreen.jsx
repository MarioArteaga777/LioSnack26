import { StyleSheet, Text, View } from "react-native";
import CustomButton from "../components/Buttons/CustomButton";
import { useAuth } from "../hooks/useAuth";

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const fullName = `${user?.name || "Cliente"} ${user?.lastName || ""}`.trim();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.welcome}>Hola, {fullName}</Text>
        <Text style={styles.caption}>
          Disfruta de nuestro catalogo de pizzas.
        </Text>

        <View style={styles.logoutContainer}>
          <CustomButton textButton="Cerrar sesion" actionButton={logout} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF5EE",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    color: "#6F3E1F",
    fontSize: 34,
    fontWeight: "800",
  },
  welcome: {
    marginTop: 12,
    color: "#8E4D24",
    fontSize: 22,
    fontWeight: "700",
  },
  caption: {
    marginTop: 8,
    color: "#875F42",
    fontSize: 15,
  },
  logoutContainer: {
    marginTop: 28,
    maxWidth: 210,
  },
});
