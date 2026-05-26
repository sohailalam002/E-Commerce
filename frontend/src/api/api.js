import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

export const AUTH_EXPIRED_EVENT = 'auth:expired';

export const clearAuthStorage = () => {
  localStorage.removeItem('shopsy_token');
  localStorage.removeItem('userInfo');
};

const api = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (JWT)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopsy_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (Error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = error.config?.url || '';
    const hasToken = Boolean(localStorage.getItem('shopsy_token'));
    const isAuthEndpoint = requestUrl.includes('/users/login') || requestUrl.includes('/users/register');

    if (status === 401 && hasToken && !isAuthEndpoint) {
      clearAuthStorage();
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }

    return Promise.reject(error);
  }
);

export default api;
