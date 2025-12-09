import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Backend base URL (única fuente)
const API_URL = "https://bravos-backend-production.up.railway.app/api";

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
  return config;
});

export default api;
