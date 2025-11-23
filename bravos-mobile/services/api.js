import axios from 'axios';

const API_URL = 'https://bravos-desarrollo.vercel.app/api'; // Cambia por tu endpoint real

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export default api;
