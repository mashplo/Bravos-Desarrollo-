import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://bravos-desarrollo.vercel.app/api"; // Cambia por tu endpoint real

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Attach token to each request if present
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore
  }
  return config;
});

export default api;
