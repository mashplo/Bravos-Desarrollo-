import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Card } from "react-native-paper";

const LOGO = require("../assets/logo.png");
const PROMO_IMAGE = require("../assets/ChatGPT Image 10 nov 2025, 10_13_54.png");

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <Text variant="displayMedium" style={styles.title}>
          Bravos Grill & Smoke
        </Text>

        <Text variant="titleLarge" style={styles.subtitle}>
          {"Descubre lo mejor en\nBravos con solo un clic"}
        </Text>

        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate("Login")}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  loginButton: {
    width: "100%",
    borderRadius: 40,
    marginTop: 8,
  },
  loginButtonContent: {
    height: 54,
  },
  signupButton: {
    width: "100%",
    borderRadius: 40,
    marginTop: 12,
  },
  signupButtonContent: {
    height: 54,
  },
  buttonLabel: {
    color: "#fff",
    fontSize: 16,
  },
  promoCard: {
    marginTop: 32,
    width: "100%",
    borderRadius: 12,
    elevation: 6,
    overflow: "hidden",
  },
  logo: {
    width: 200,
    height: 140,
    marginBottom: 12,
    alignSelf: "center",
  },
  promoImage: {
    width: "100%",
    height: 120,
  },
});
 