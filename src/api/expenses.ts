import axios from 'axios';
import Expense from '../types/Expense';
import { getSessionToken } from './session';

const API_URL = 'https://spendly-sehe.onrender.com/api/expenses';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getSessionToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axiosInstance.get('/');
  return response.data.map((expense: any) => ({ ...expense, id: expense._id }));
};

export const createExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const response = await axiosInstance.post('/', expense);
  return { ...response.data, id: response.data._id };
};

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  const { id, ...rest } = expense;
  const response = await axiosInstance.put(`/${id}`, rest);
  return { ...response.data, id: response.data._id };
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/${id}`);
};
