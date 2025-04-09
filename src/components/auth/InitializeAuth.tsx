'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authService } from '@/services/auth.service';

export const InitializeAuth = () => {
  const { initializeFromStorage, signIn, signOut } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        // First initialize from storage
        initializeFromStorage();
        
        // Then verify token with backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response = await authService.getUserInfo();
            if (response?.content) {
              signIn(response.content, token);
            } else {
              throw new Error('Invalid user data');
            }
          } catch (error) {
            console.error('Failed to verify token:', error);
            signOut();
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        signOut();
      }
    };

    initialize();
  }, [initializeFromStorage, signIn, signOut]);

  return null;
};
