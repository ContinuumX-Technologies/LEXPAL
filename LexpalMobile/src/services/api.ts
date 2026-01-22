import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// REPLACE with your machine's LAN IP (e.g., 192.168.1.5:5000)
const API_URL = 'http://192.168.1.X:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically add Token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('userToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  loginUser: (data: any) => api.post('/auth/login', data), //
  registerUser: (data: any) => api.post('/auth/register', data),
  loginLawyer: (data: any) => api.post('/lawyer/login', data), //
  registerLawyer: (data: any) => api.post('/lawyer/register', data),
};

export default api;