import axios from 'axios';
import { getSessionToken } from './session';

const API_URL = 'https://spendly-sehe.onrender.com/api/auth';

const authApi = axios.create({
  baseURL: API_URL,
});

authApi.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const signup = async (userData: any) => {
  const response = await authApi.post('/signup', userData);
  return response.data;
};

export const login = async (userData: any) => {
  const response = await authApi.post('/login', userData);
  return response.data;
};
