import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Text, Button, TextInput, Card } from "react-native-paper";
import api from "../services/api";
import { saveToken } from "../store/user";

const LOGO = require("../assets/logo.png");
const PROMO_IMAGE = require("../assets/ChatGPT Image 10 nov 2025, 10_13_54.png");

export default function LoginScreenNew({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Desarrollo: bypass temporal del backend — navegar directamente a Menu
    // Cuando el backend esté listo, restaurar la lógica de login con API.
    navigation.navigate("Menu", { initialCategory: "hamburguesas" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.subtitle}>
          {"Descrubre lo mejor en\nBravos con solo un clic"}
        </Text>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="flat"
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode="flat"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          buttonColor="#7a4f1d"
          labelStyle={styles.buttonLabel}
          contentStyle={styles.loginButtonContent}
          style={styles.loginButton}
        >
          Log In
        </Button>

        <Button
          mode="outlined"
          onPress={() => navigation.navigate("Register")}
          style={[styles.signupButton, { borderColor: "#7a4f1d" }]}
          labelStyle={[styles.buttonLabel, { color: "#7a4f1d" }]}
          contentStyle={styles.signupButtonContent}
        >
          Sign Up
        </Button>
      </View>

      <Card style={styles.promoCard}>
        <Image
          source={PROMO_IMAGE}
          style={styles.promoImage}
          resizeMode="cover"
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  top: {
    alignItems: "center",
    paddingTop: 24,
  },
  logo: {
    width: 200,
    height: 140,
  },
  content: {
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 20,
    color: "#666",
  },
  input: {
    width: "100%",
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  loginButton: {
    width: "100%",
    borderRadius: 40,
    marginTop: 20,
  },
  loginButtonContent: {
    height: 54,
  },
  signupButton: {
    width: "100%",
    borderRadius: 40,
    marginTop: 18,
  },
  signupButtonContent: {
    height: 54,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  promoCard: {
    margin: 20,
    borderRadius: 16,
    elevation: 6,
    overflow: "hidden",
  },
  promoInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  promoTextWrap: {
    flex: 1,
  },
  promoText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },
  promoSub: {
    color: "#fff",
    marginTop: 4,
  },
  burgerCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
    overflow: "hidden",
  },
  burgerImageCircle: {
    width: 76,
    height: 68,
    borderRadius: 36,
  },
  promoImage: {
    width: "100%",
    height: 120,
  },
});
