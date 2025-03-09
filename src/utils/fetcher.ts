import axios from 'axios';
import Cookies from 'js-cookie'; // Dùng cookies để lưu token an toàn trên server

const BASE_URL = 'https://airbnbnew.cybersoft.edu.vn/api';
const TOKEN_CYBERSOFT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OCIsIkhldEhhblN0cmluZyI6IjI3LzA3LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1MzU3NDQwMDAwMCIsIm5iZiI6MTcyNjA3NDAwMCwiZXhwIjoxNzUzNzIyMDAwfQ.BTmM2iB4rp2M5zBswdnAhImSAoSPeaxquN5mTgxFzaQ';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'TokenCybersoft': TOKEN_CYBERSOFT,
    'Content-Type': 'application/json',
  },
});

//  Interceptor để thêm token vào request (tránh lỗi khi chạy trên server)
api.interceptors.request.use((config) => {
  let token = '';

  // Kiểm tra xem đang chạy trên client-side (browser)
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token') || '';
  } else {
    token = Cookies.get('token') || ''; // Dùng cookies trên server
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
