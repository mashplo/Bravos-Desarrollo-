import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from 'expo-device';

// Backend base URL
const API_URL = "https://bravos-backend-production.up.railway.app/api";

// Generar o recuperar deviceId único para este dispositivo móvil
async function getDeviceId() {
  let deviceId = await AsyncStorage.getItem("deviceId");
  if (!deviceId) {
    const deviceInfo = Device.modelName || Device.deviceName || "unknown";
    deviceId = `mobile-${deviceInfo}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    await AsyncStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
}

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("jwt").catch(() => null);
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Agregar deviceId a todas las peticiones de auth
  if (config.url?.includes('/auth/')) {
    const deviceId = await getDeviceId();
    if (config.data) {
      config.data = {
        ...config.data,
        deviceId,
        deviceType: "mobile"
      };
    }
  }

  return config;
});

export default api;
export { getDeviceId };
