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
      const url = error.config && error.config.url ? error.config.url : '';
      const data = error.response.data || {};
      const code = data.code;
      
      // Handle Concurrent Login Termination
      if (code === 'SESSION_TERMINATED') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('session_terminated', {
          detail: {
            message: data.message || 'Your account was logged in from another device.'
          }
        }));
        return Promise.reject(error);
      }

      // Don't redirect on login endpoints — let the form handle the error
      const isLoginEndpoint = url.includes('/login');
      if (!isLoginEndpoint) {
        localStorage.removeItem('sa_token');
        localStorage.removeItem('sa_user');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.response && error.response.status === 403) {
      const code = error.response.data && error.response.data.code;
      if (code === 'TRIAL_EXPIRED' || code === 'SUBSCRIPTION_EXPIRED' || code === 'ACCOUNT_SUSPENDED' || code === 'SUBSCRIPTION_REQUIRED') {
        if (code === 'TRIAL_EXPIRED') {
          try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            user.subscription_status = 'expired';
            localStorage.setItem('user', JSON.stringify(user));
          } catch (e) {}
          window.dispatchEvent(new Event('trial_expired'));
        }
        window.dispatchEvent(new CustomEvent('auth:subscription_status', {
          detail: {
            code,
            data: error.response?.data?.data
          }
        }));
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
