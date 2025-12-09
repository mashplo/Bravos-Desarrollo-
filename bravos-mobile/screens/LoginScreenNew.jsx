import React, { useState } from "react";
import { View, StyleSheet, Alert, Image, Modal } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api, { getDeviceId } from "../services/api";

const LOGO = require("../assets/logo.png");
const PROMO_IMAGE = require("../assets/ChatGPT Image 10 nov 2025, 10_13_54.png");

export default function LoginScreenNew({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sessionData, setSessionData] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Error", "Por favor ingresa un correo válido");
      return;
    }

    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      console.log("Intentando login con:", { email, deviceId });
      
      const res = await api.post("/auth/login", { 
        email, 
        password,
        deviceId,
        deviceType: "mobile"
      });
      
      console.log("Respuesta del servidor:", res.data);

      // Si requiere confirmación
      if (res.data && res.data.requireConfirmation) {
        setSessionData({ email, password });
        setShowConfirmDialog(true);
        setLoading(false);
        return;
      }

      if (res.data && res.data.success && res.data.token) {
        await AsyncStorage.setItem("jwt", res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

        console.log("Login exitoso, token guardado");
        Alert.alert("Bienvenido", `Hola ${res.data.user.nombre}`, [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("Menu", { initialCategory: "hamburguesas" }),
          },
        ]);
      } else {
        Alert.alert("Error", res.data?.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error en login:", err);
      console.error("Detalles:", err.response?.data);
      const errorMsg =
        err.response?.data?.message || "No se pudo conectar con el servidor";
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForceLogin = async () => {
    if (!sessionData) return;

    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      const res = await api.post("/auth/login/force", {
        email: sessionData.email,
        password: sessionData.password,
        deviceId,
        deviceType: "mobile",
        forceLogin: true
      });

      setShowConfirmDialog(false);
      setSessionData(null);

      if (res.data && res.data.success && res.data.token) {
        await AsyncStorage.setItem("jwt", res.data.token);
        await AsyncStorage.setItem("user", JSON.stringify(res.data.user));

        Alert.alert(
          "Sesión iniciada",
          "Las otras sesiones han sido cerradas",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.navigate("Menu", { initialCategory: "hamburguesas" }),
            },
          ]
        );
      } else {
        Alert.alert("Error", res.data?.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error en force login:", err);
      Alert.alert("Error", err.response?.data?.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelForceLogin = () => {
    setShowConfirmDialog(false);
    setSessionData(null);
    Alert.alert("Cancelado", "Inicio de sesión cancelado");
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
          secureTextEntry={!showPassword}
          mode="flat"
          style={styles.input}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              onPress={() => setShowPassword((p) => !p)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={handleLogin}
          buttonColor="#7a4f1d"
          labelStyle={styles.buttonLabel}
          contentStyle={styles.loginButtonContent}
          style={styles.loginButton}
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : "Log In"}
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

      {/* Modal de confirmación */}
      <Modal
        visible={showConfirmDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelForceLogin}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text variant="headlineSmall" style={styles.modalTitle}>
              Sesión activa detectada
            </Text>
            <Text variant="bodyMedium" style={styles.modalMessage}>
              Tu cuenta está activa en otro dispositivo. ¿Deseas continuar aquí y cerrar la otra sesión?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={handleCancelForceLogin}
                style={styles.modalButton}
                disabled={loading}
              >
                No
              </Button>
              <Button
                mode="contained"
                onPress={handleForceLogin}
                buttonColor="#7a4f1d"
                style={styles.modalButton}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#fff" size="small" /> : "Sí"}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
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
  promoImage: {
    width: "100%",
    height: 120,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    elevation: 8,
  },
  modalTitle: {
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  modalMessage: {
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
  },
  modalButton: {
    flex: 1,
  },
});
