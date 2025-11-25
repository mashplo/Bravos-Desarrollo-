import React, { useState } from "react";
import { View, StyleSheet, Alert, Image } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
const LOGO = require("../assets/logo.png");
import api from "../services/api";

export default function RegisterScreen({ navigation }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {  
    if (!email || !email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    try {
      const res = await api.post('/auth/register', {
        nombre,
        email,
        password,
      });
      if (res.data && res.data.success) {
        Alert.alert("Registro exitoso", "Ya puedes iniciar sesión");
        navigation.navigate("Login");
      } else {
        Alert.alert("Error", res.data?.message || "No se pudo registrar");
      }
    } catch (err) {
      Alert.alert("Error", "No se pudo registrar");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />

        <View style={styles.formCard}>
          <Text variant="headlineSmall" style={styles.title}>
            Registro
          </Text>

          <TextInput
            label="Nombres"
            value={nombre}
            onChangeText={setNombre}
            mode="flat"
            style={styles.input}
          />
          <TextInput
            label="Correo"
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
            mode="flat"
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            label="Repite la contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="flat"
            secureTextEntry
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={handleRegister}
            buttonColor="#7a4f1d"
            contentStyle={styles.buttonContent}
            style={styles.button}
          >
            Registrarse
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.navigate("Login")}
            style={[styles.button, { marginTop: 12 }]}
            labelStyle={{ color: "#7a4f1d" }}
          >
            Ya tengo cuenta
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    alignItems: "center",
  },
  logo: { width: 140, height: 120, marginBottom: 18 },
  formCard: {
    width: "100%",
    backgroundColor: "#fff6f0",
    borderColor: "#7a4f1d",
    borderWidth: 1,
    padding: 18,
    borderRadius: 8,
  },
  title: {
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    alignSelf: "center",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "transparent",
  },
  button: { borderRadius: 40, marginTop: 6 },
  buttonContent: { height: 52 },
});
