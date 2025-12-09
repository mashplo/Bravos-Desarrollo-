import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

// Backend base URL
const API_URL = "https://bravos-backend-production.up.railway.app/api";

// Generar o recuperar deviceId único para este dispositivo móvil
async function getDeviceId() {
  let deviceId = await AsyncStorage.getItem("deviceId");
  if (!deviceId) {
    const deviceInfo = Device.modelName || Device.deviceName || "unknown";
    deviceId = `mobile-${deviceInfo}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    await AsyncStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Variable para almacenar callback de sesión expirada
let onSessionExpired = null;

export function setOnSessionExpired(callback) {
  onSessionExpired = callback;
}

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt").catch(() => null);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar deviceId a todas las peticiones de auth
  if (config.url?.includes("/auth/")) {
    const deviceId = await getDeviceId();
    if (config.data) {
      config.data = {
        ...config.data,
        deviceId,
        deviceType: "mobile",
      };
    }
  }

  return config;
});

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Si es un error 409 con requireConfirmation, resolverlo como éxito para manejarlo en el componente
    if (
      error.response?.status === 409 &&
      error.response?.data?.requireConfirmation
    ) {
      return Promise.resolve(error.response);
    }

    // Si la sesión expiró (401 con sessionExpired), limpiar storage y notificar
    if (
      error.response?.status === 401 &&
      error.response?.data?.sessionExpired
    ) {
      await AsyncStorage.removeItem("jwt");
      await AsyncStorage.removeItem("user");
      if (onSessionExpired) {
        onSessionExpired();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { getDeviceId };

// Función para obtener productos del backend
export async function getProductos() {
  try {
    const response = await api.get("/productos");
    if (response.data?.success) {
      return response.data.productos;
    }
    return null;
  } catch (error) {
    console.error("Error obteniendo productos:", error);
    return null;
  }
}
