import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Create axios instance with base config
const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor
instance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const authStore = useAuthStore();

    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      try {
        await authStore.refreshAccessToken();
        error.config.headers.Authorization = `Bearer ${authStore.accessToken}`;
        return instance(error.config);
      } catch (refreshError) {
        // If refresh token fails, logout user
        await authStore.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
