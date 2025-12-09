import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
} from "react-native";
import {
  Text,
  TextInput,
  Button,
  ActivityIndicator,
  Card,
  IconButton,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/profile");

      if (response.data && response.data.success) {
        setUser(response.data.user);
        setFormData({
          nombre: response.data.user.nombre || "",
          email: response.data.user.email || "",
          username: response.data.user.username || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        Alert.alert("Error", response.data?.message || "Error al cargar el perfil");
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      Alert.alert("Error", "No se pudo cargar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validación
    if (!formData.nombre || !formData.email || !formData.username) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      Alert.alert("Error", "Las contraseñas nuevas no coinciden");
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (formData.newPassword && !formData.currentPassword) {
      Alert.alert("Error", "Debes ingresar tu contraseña actual para cambiarla");
      return;
    }

    try {
      setSaving(true);

      const updateData = {
        nombre: formData.nombre,
        email: formData.email,
        username: formData.username,
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await api.put("/profile", updateData);

      if (response.data && response.data.success) {
        setUser(response.data.user);
        setFormData({
          nombre: response.data.user.nombre,
          email: response.data.user.email,
          username: response.data.user.username,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Actualizar usuario en AsyncStorage
        await AsyncStorage.setItem("user", JSON.stringify(response.data.user));

        Alert.alert("Éxito", response.data.message || "¡Perfil actualizado exitosamente!");
        setIsEditing(false);
      } else {
        Alert.alert("Error", response.data?.message || "Error al actualizar el perfil");
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Error al actualizar el perfil"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre || "",
      email: user.email || "",
      username: user.username || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7a4f1d" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          Mi Perfil
        </Text>
        {!isEditing && (
          <IconButton
            icon="pencil"
            size={24}
            onPress={() => setIsEditing(true)}
            iconColor="#7a4f1d"
          />
        )}
        {isEditing && <View style={{ width: 48 }} />}
      </View>

      <ScrollView style={styles.content}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user?.nombre?.charAt(0).toUpperCase() || "U"}
                </Text>
              </View>
              <Text variant="titleMedium" style={styles.subtitle}>
                Administra tu información de cuenta
              </Text>
            </View>

            <TextInput
              label="Nombre Completo"
              value={formData.nombre}
              onChangeText={(value) => handleInputChange("nombre", value)}
              disabled={!isEditing}
              mode="outlined"
              style={styles.input}
              maxLength={18}
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Usuario"
              value={formData.username}
              onChangeText={(value) => handleInputChange("username", value)}
              disabled={!isEditing}
              mode="outlined"
              style={styles.input}
              left={<TextInput.Icon icon="at" />}
            />

            <TextInput
              label="Correo Electrónico"
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              disabled={!isEditing}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />

            {user?.role && (
              <TextInput
                label="Rol"
                value={user.role}
                disabled={true}
                mode="outlined"
                style={styles.input}
                left={<TextInput.Icon icon="shield-account" />}
              />
            )}

            {isEditing && (
              <View style={styles.passwordSection}>
                <Text variant="titleMedium" style={styles.passwordTitle}>
                  Cambiar Contraseña
                </Text>
                <Text variant="bodySmall" style={styles.passwordSubtitle}>
                  Deja en blanco si no deseas cambiar tu contraseña
                </Text>

                <TextInput
                  label="Contraseña Actual"
                  value={formData.currentPassword}
                  onChangeText={(value) =>
                    handleInputChange("currentPassword", value)
                  }
                  secureTextEntry
                  mode="outlined"
                  style={styles.input}
                  placeholder="Requerida para cambiar contraseña"
                  left={<TextInput.Icon icon="lock" />}
                />

                <TextInput
                  label="Nueva Contraseña"
                  value={formData.newPassword}
                  onChangeText={(value) => handleInputChange("newPassword", value)}
                  secureTextEntry
                  mode="outlined"
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  left={<TextInput.Icon icon="lock" />}
                />

                <TextInput
                  label="Confirmar Nueva Contraseña"
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    handleInputChange("confirmPassword", value)
                  }
                  secureTextEntry
                  mode="outlined"
                  style={styles.input}
                  placeholder="Repite la nueva contraseña"
                  left={<TextInput.Icon icon="lock" />}
                />
              </View>
            )}

            {isEditing && (
              <View style={styles.actionButtons}>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={saving}
                  buttonColor="#7a4f1d"
                  style={styles.saveButton}
                  icon="content-save"
                >
                  {saving ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  disabled={saving}
                  style={styles.cancelButton}
                  icon="close"
                >
                  Cancelar
                </Button>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 8,
    elevation: 2,
  },
  headerTitle: {
    fontWeight: "700",
    flex: 1,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    borderRadius: 12,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#7a4f1d",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
  },
  input: {
    marginBottom: 12,
  },
  passwordSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  passwordTitle: {
    fontWeight: "700",
    marginBottom: 8,
  },
  passwordSubtitle: {
    color: "#666",
    marginBottom: 16,
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  saveButton: {
    borderRadius: 8,
  },
  cancelButton: {
    borderRadius: 8,
  },
});
