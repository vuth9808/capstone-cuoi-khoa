'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

export const InitializeAuth = () => {
  const { initializeFromStorage, signIn, signOut } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      initializeFromStorage();
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await authService.getUserInfo();
          signIn(response.content, token);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          signOut();
        }
      }
    };

    initialize();
  }, [initializeFromStorage, signIn, signOut]);

  return null;
};
