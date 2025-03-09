import api from '../utils/fetcher';
import { User } from '../types/user';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/signin', { email, password });
  return response.data;
};

export const register = async (userData: Omit<User, 'id' | 'role'>) => {
  const response = await api.post('/auth/signup', userData);
  return response.data;
};

export const getUserInfo = async () => {
  const response = await api.get('/users');
  return response.data;
};