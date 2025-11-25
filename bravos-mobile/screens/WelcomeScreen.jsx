import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Card } from "react-native-paper";
const LOGO = require("../assets/logo.png");

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      <Text variant="headlineMedium" style={styles.title}>
        ¡Bienvenido a Bravos!
      </Text>
      <Text style={styles.subtitle}>
        Hamburguesas, papas y bebidas a un click.
      </Text>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
        buttonColor="#7a4f1d"
        contentStyle={styles.buttonContent}
      >
        Iniciar sesión
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate("Register")}
        style={styles.button}
        labelStyle={{ color: "#7a4f1d" }}
      >
        Registrarse
      </Button>
      <Card style={styles.promoCard}>
        <Card.Content>
          <Text style={styles.promoText}>
            🍔 ¡Prueba nuestra Hamburguesa Texana y obtén una bebida gratis!
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logo: { width: 160, height: 120, marginBottom: 18 },
  title: {
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 18,
    textAlign: "center",
    color: "#7a4f1d",
  },
  button: { borderRadius: 40, marginTop: 6, width: "100%" },
  buttonContent: { height: 52 },
  promoCard: {
    marginTop: 24,
    backgroundColor: "#fff6f0",
    borderColor: "#7a4f1d",
    borderWidth: 1,
    borderRadius: 8,
    width: "100%",
  },
  promoText: {
    color: "#7a4f1d",
    fontWeight: "bold",
    textAlign: "center",
  },
});
