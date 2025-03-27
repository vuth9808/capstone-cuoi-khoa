import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { User } from '@/types';

export const userService = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return axiosInstance.get('/nguoi-dung');
  },

  getUserById: async (id: number): Promise<ApiResponse<User>> => {
    return axiosInstance.get(`/nguoi-dung/${id}`);
  },

  createUser: async (payload: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
    return axiosInstance.post('/nguoi-dung', payload);
  },

  updateUser: async (id: number, payload: Partial<User>): Promise<ApiResponse<User>> => {
    return axiosInstance.put(`/nguoi-dung/${id}`, payload);
  },

  deleteUser: async (id: number): Promise<ApiResponse<void>> => {
    return axiosInstance.delete(`/nguoi-dung/${id}`);
  },

  // Additional user-specific operations
  updateAvatar: async (id: number, file: File): Promise<ApiResponse<User>> => {
    const formData = new FormData();
    formData.append('formFile', file);
    return axiosInstance.post(`/nguoi-dung/upload-avatar/${id}`, formData);
  },

  searchUsers: async (keyword: string): Promise<ApiResponse<User[]>> => {
    const params = new URLSearchParams({ keyword });
    return axiosInstance.get(`/nguoi-dung/search?${params}`);
  },

  // Get user's bookings
  getUserBookings: async (id: number): Promise<ApiResponse<User>> => {
    return axiosInstance.get(`/dat-phong/lay-theo-nguoi-dung/${id}`);
  },

  // Get user's reviews
  getUserReviews: async (id: number): Promise<ApiResponse<User>> => {
    return axiosInstance.get(`/binh-luan/lay-binh-luan-theo-nguoi-dung/${id}`);
  }
};
