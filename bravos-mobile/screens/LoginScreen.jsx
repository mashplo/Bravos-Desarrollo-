import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Text, Button, TextInput, Card } from "react-native-paper";
import api from "../services/api";
import { saveToken } from "../store/user";

const LOGO_URL =
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&auto=format&fit=crop&q=80";
const BURGER_URL =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      if (res.data.token) {
        await saveToken(res.data.token);
        Alert.alert("Bienvenido", "Login exitoso");
        navigation.navigate("Menu");
      } else {
        Alert.alert("Error", res.data.message || "No se pudo iniciar sesión");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Image
          source={{ uri: LOGO_URL }}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.content}>
        <Text variant="displayMedium" style={styles.title}>
          Bravos Grill & Smoke
        </Text>
        <Text variant="titleLarge" style={styles.subtitle}>
          Descubre lo mejor en Bravos con solo un clic.
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
          buttonColor="#7a4f1d"
          onPress={handleLogin}
          style={styles.loginButton}
          contentStyle={styles.loginButtonContent}
        >
          Log In
        </Button>

        <Button
          mode="outlined"
          textColor="#7a4f1d"
          onPress={() => navigation.navigate("Register")}
          style={styles.signupButton}
          contentStyle={styles.signupButtonContent}
        >
          Sign Up
        </Button>
      </View>

      <Card style={styles.promoCard}>
        <View style={styles.promoInner}>
          <View style={styles.promoTextWrap}>
            <Text variant="titleMedium" style={styles.promoText}>
              15%+ Descuento en tu primera orden
            </Text>
          </View>
          <Image source={{ uri: BURGER_URL }} style={styles.burgerImage} />
        </View>
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
    width: 120,
    height: 80,
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
    marginTop: 8,
  },
  loginButtonContent: {
    height: 50,
  },
  signupButton: {
    width: "100%",
    borderRadius: 40,
    marginTop: 16,
    borderColor: "#7a4f1d",
  },
  signupButtonContent: {
    height: 50,
  },
  promoCard: {
    margin: 20,
    borderRadius: 12,
    backgroundColor: "#e6c9a0",
    elevation: 4,
  },
  promoInner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  promoTextWrap: {
    flex: 1,
  },
  promoText: {
    color: "#7a4f1d",
    fontWeight: "700",
  },
  burgerImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginLeft: 12,
  },
});
