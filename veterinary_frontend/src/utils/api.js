import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const isSuperAdminRoute = config.url && config.url.includes('/api/super-admin');
    const token = isSuperAdminRoute ? localStorage.getItem('sa_token') : localStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      const isSuperAdminRoute = error.config && error.config.url && error.config.url.includes('/api/super-admin');
      
      if (isSuperAdminRoute) {
        localStorage.removeItem('sa_token');
        localStorage.removeItem('sa_user');
        window.location.href = '/super-admin/login';
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Wrapper that mimics fetch but uses the axios instance (for easy migration)
export const apiFetch = async (url, options = {}) => {
  const method = options.method || 'GET';
  const data = options.body ? JSON.parse(options.body) : undefined;
  
  // Remove hardcoded base URL / origin if present
  const cleanUrl = url.replace(/^https?:\/\/[^\/]+/, '');

  try {
    const res = await api({
      url: cleanUrl,
      method,
      data,
    });
    
    return {
      status: res.status,
      ok: res.status >= 200 && res.status < 300,
      json: async () => res.data
    };
  } catch (error) {
    if (error.response) {
      return {
        status: error.response.status,
        ok: false,
        json: async () => error.response.data
      };
    }
    throw error;
  }
};

export default api;
