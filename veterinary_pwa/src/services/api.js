import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5002';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('pwa_token') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle offline fallback & errors
api.interceptors.response.use(
  (response) => {
    // Cache successful GET requests locally for offline access
    if (response.config.method === 'get' && response.data?.status === 'success') {
      try {
        const cacheKey = `pwa_cache_${response.config.url}`;
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response.data,
          cachedAt: Date.now()
        }));
      } catch (e) {
        // LocalStorage quota might be full
      }
    }
    return response;
  },
  (error) => {
    // If offline or network error on GET, attempt to load cached payload
    if ((!error.response || error.code === 'ERR_NETWORK') && error.config?.method === 'get') {
      const cacheKey = `pwa_cache_${error.config.url}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          console.warn('[PWA API] Serving from offline cache:', error.config.url);
          return Promise.resolve({
            data: {
              ...parsed.data,
              _isOfflineCached: true,
              _cachedAt: parsed.cachedAt
            },
            status: 200,
            statusText: 'OK (Offline Cached)'
          });
        } catch (e) {}
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('pwa_token');
      localStorage.removeItem('pwa_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
