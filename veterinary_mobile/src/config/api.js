import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Local IP address of your PC for real physical mobile devices on the same Wi-Fi
const LOCAL_PC_IP = '192.168.1.27';
const DEV_API_URL = Platform.OS === 'android' ? `http://${LOCAL_PC_IP}:5001/api/v1` : `http://${LOCAL_PC_IP}:5001/api/v1`;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor to attach JWT auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('@vetcare_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('Error reading auth token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
