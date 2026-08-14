import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OfflineSyncService from '../services/OfflineSyncService';
import Constants from 'expo-constants';

// Auto-detect PC's IP address from Expo hostUri if available, fallback to 192.168.1.73
let detectedIp = '192.168.1.73';
try {
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || Constants.manifest2?.extra?.expoGo?.debuggerHost;
  if (hostUri) {
    detectedIp = hostUri.split(':')[0];
  }
} catch (e) {
  console.log('Error detecting Expo host IP:', e);
}

const LOCAL_PC_IP = detectedIp || '192.168.1.73';
const DEV_API_URL = `http://${LOCAL_PC_IP}:5000/api/v1`;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEV_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Configure OfflineSyncService with this API client
OfflineSyncService.setApiClient(api);

// Get standard adapter helper using clean axios instance request to avoid duplicate adapter intercept loop
const standardAdapter = async (config) => {
  const cleanAxios = axios.create();
  const { adapter, ...cleanConfig } = config;
  return cleanAxios.request(cleanConfig);
};

// These routes MUST always reach the real backend — never queue them offline
const AUTH_ROUTES = ['/auth/login', '/super-admin/login', '/auth/register', '/auth/logout'];
const isAuthRoute = (url = '') => AUTH_ROUTES.some((r) => url.includes(r));

// Custom Adapter to handle Offline Caching and Sync Queueing
api.defaults.adapter = async (config) => {
  const method = (config.method || 'get').toLowerCase();
  const url = config.url;

  // Auth routes: always pass through to real server, never queue offline
  if (isAuthRoute(url)) {
    return standardAdapter(config);
  }

  // Intercept requests when offline
  if (!OfflineSyncService.isOnline) {
    if (method === 'get') {
      console.log(`[api.js] Offline: Fetching cached data for GET ${url}`);
      const cached = await OfflineSyncService.getCachedData(url);
      if (cached) {
        return {
          data: cached.data,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          request: {},
        };
      }
      return Promise.reject(new Error('Network error: Device is offline and no cache is available.'));
    } else {
      // POST, PUT, DELETE mutations
      console.log(`[api.js] Offline: Queueing mutation for ${method.toUpperCase()} ${url}`);
      const queued = await OfflineSyncService.queueMutation(url, method, config.data, config.headers);
      return {
        data: {
          success: true,
          message: 'Saved offline (Pending sync)',
          offline: true,
          queueId: queued.id,
        },
        status: 202,
        statusText: 'Accepted',
        headers: {},
        config,
        request: {},
      };
    }
  }

  // If online, perform the standard network request
  try {
    const response = await standardAdapter(config);

    // If request succeeded and was a GET, cache the fresh data
    if (method === 'get' && response.status === 200) {
      await OfflineSyncService.cacheData(url, response.data);
    }

    return response;
  } catch (error) {
    // If request failed because of connection issue (no server response), check cache or queue
    const isNetworkError =
      !error.response ||
      error.code === 'ECONNABORTED' ||
      error.message.includes('Network Error');

    if (isNetworkError) {
      if (method === 'get') {
        console.log(`[api.js] Network Error: Fallback to cached data for GET ${url}`);
        const cached = await OfflineSyncService.getCachedData(url);
        if (cached) {
          return {
            data: cached.data,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
            request: {},
          };
        }
      } else {
        console.log(`[api.js] Network Error: Queueing mutation for ${method.toUpperCase()} ${url}`);
        const queued = await OfflineSyncService.queueMutation(url, method, config.data, config.headers);
        return {
          data: {
            success: true,
            message: 'Saved offline (Pending sync)',
            offline: true,
            queueId: queued.id,
          },
          status: 202,
          statusText: 'Accepted',
          headers: {},
          config,
          request: {},
        };
      }
    }

    return Promise.reject(error);
  }
};

// Interceptor to attach JWT auth token from SecureStore or AsyncStorage
api.interceptors.request.use(
  async (config) => {
    try {
      let token = null;
      try {
        const SecureStore = require('expo-secure-store');
        // Key must not contain '@' — only alphanumeric, '.', '-', '_'
        token = await SecureStore.getItemAsync('vetcare_token');
      } catch (err) {
        token = await AsyncStorage.getItem('vetcare_token');
      }

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
