'use client';

import axios from 'axios';

export const baseURL = 'https://airbnbnew.cybersoft.edu.vn/api';

export interface ApiResponse<T> {
  statusCode: number;
  content: T;
  dateTime: string;
  message: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  dateTime: string;
}

// Type guard for axios error
function isAxiosError(error: unknown): error is {
  response?: { status: number; data: unknown };
  request?: unknown;
  message: string;
} {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    (('response' in error && typeof error.response === 'object') ||
      ('request' in error && typeof error.request === 'object'))
  );
}

// Create axios instance with default config
const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    TokenCybersoft:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OCIsIkhldEhhblN0cmluZyI6IjI3LzA3LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1MzU3NDQwMDAwMCIsIm5iZiI6MTcyNjA3NDAwMCwiZXhwIjoxNzUzNzIyMDAwfQ.BTmM2iB4rp2M5zBswdnAhImSAoSPeaxquN5mTgxFzaQ',
  },
  timeout: 10000, // 10 seconds
});

// Utility function to safely access localStorage
const getToken = () => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  
  // Log token để debug
  console.log('Raw token from localStorage:', token);
  
  // Trả về token gốc
  return token;
};

// Add request interceptor for auth token
instance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      // Chỉ sử dụng header 'token' theo yêu cầu của API
      config.headers.token = token.replace('Bearer ', '');
      
      // Log để debug
      console.log('Setting token header:', config.headers.token.substring(0, 15) + '...');
      
      // Don't override Content-Type if it's FormData
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    } else {
      console.log('No token found for request');
    }
    
    // Log toàn bộ request để debug
    console.log('Request URL:', config.url);
    console.log('Request Method:', config.method?.toUpperCase());
    console.log('Request Headers:', JSON.stringify(config.headers));
    
    return config;
  },
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.content ||
      'Đã xảy ra lỗi không xác định';

    return Promise.reject(new Error(message));
  }
);

// Create a wrapper around axios that returns our ApiResponse type
export const axiosInstance = {
  async get<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const { data } = await instance.get<ApiResponse<T>>(url);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async post<T>(
    url: string,
    body?: unknown,
    config?: {
      headers?: Record<string, string | undefined>;
      params?: Record<string, string | number>;
    }
  ): Promise<ApiResponse<T>> {
    try {
      const { data } = await instance.post<ApiResponse<T>>(url, body, config);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async put<T>(url: string, body?: unknown): Promise<ApiResponse<T>> {
    try {
      const { data } = await instance.put<ApiResponse<T>>(url, body);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    try {
      const { data } = await instance.delete<ApiResponse<T>>(url);
      return data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  },
};

// Helper function to handle axios errors
const handleAxiosError = (error: unknown): Error => {
  if (isAxiosError(error) && error.response) {
    const { data, status } = error.response;
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth/signin';
      }
      return new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
    }
    if (status === 403) {
      return new Error('Bạn không có quyền thực hiện thao tác này');
    }
    if (status === 404) {
      return new Error('Không tìm thấy tài nguyên');
    }
    return new Error((data as ApiError)?.message || 'Đã có lỗi xảy ra');
  }
  if (isAxiosError(error) && error.request) {
    return new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng');
  }
  return new Error('Đã có lỗi xảy ra');
};

// Add response interceptor for error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!isAxiosError(error) || !error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng'));
    }

    const { status, data } = error.response;
    console.error(`Response error ${status}:`, JSON.stringify(data));

    // Handle specific status codes
    switch (status) {
      case 400:
        return Promise.reject(new Error((data as ApiError)?.message || 'Yêu cầu không hợp lệ'));
      case 401:
        console.error('Auth error 401:', JSON.stringify(data));
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/signin';
        }
        return Promise.reject(new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại'));
      case 403:
        console.error('Permission error 403:', JSON.stringify(data));
        return Promise.reject(new Error('Bạn không có quyền thực hiện thao tác này'));
      case 404:
        return Promise.reject(new Error((data as ApiError)?.message || 'Không tìm thấy tài nguyên'));
      case 422:
        return Promise.reject(new Error((data as ApiError)?.message || 'Dữ liệu không hợp lệ'));
      case 429:
        return Promise.reject(new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau'));
      case 500:
        return Promise.reject(new Error('Lỗi máy chủ. Vui lòng thử lại sau'));
      default:
        return Promise.reject(new Error((data as ApiError)?.message || 'Đã có lỗi xảy ra'));
    }
  }
);
