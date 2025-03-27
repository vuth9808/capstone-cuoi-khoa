import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { User } from '@/types';

interface SignInResponse {
  user: User;
  token: string;
}

export const authService = {
  signin: async (payload: { email: string; password: string }): Promise<ApiResponse<SignInResponse>> => {
    return axiosInstance.post('/auth/signin', payload);
  },

  signup: async (payload: Omit<User, 'id' | 'role'>): Promise<ApiResponse<User>> => {
    return axiosInstance.post('/auth/signup', payload);
  },

  getUserInfo: async (): Promise<ApiResponse<User>> => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    const userId = JSON.parse(localStorage.getItem('user') || '{}').id;
    if (!userId) {
      throw new Error('No user ID found');
    }
    return axiosInstance.get(`/users/${userId}`);
  },
};
