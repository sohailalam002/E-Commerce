import axios from 'axios';

// Use environment variable
const API = import.meta.env.VITE_API_URL;
console.log("API URL:", import.meta.env.VITE_API_URL);
// Create Axios instance
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
    const message = error.response?.data?.message || 'Something went wrong';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);

export default api;