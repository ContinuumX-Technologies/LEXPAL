
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use localhost for iOS simulator, specific IP for Android
// UPDATE THIS IP if testing on physical device 
const DEV_SERVER_URL = 'http://172.20.10.3:5001';

const api = axios.create({
    baseURL: DEV_SERVER_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // For cookies if your server uses them
});

// Interceptor to add token if you shift to Bearer tokens in future
// For now, if your backend sets httpOnly cookies, axios on React Native might need manual cookie handling 
// or if you return a token in body like { token: ... }, we save it.

api.interceptors.request.use(async (config) => {
    // If we have a stored token, add it
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
