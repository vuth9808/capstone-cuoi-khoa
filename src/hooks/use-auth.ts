import { useEffect, useState } from 'react';
import { User } from '@/types';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const { user, signIn, signOut } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await authService.getUserInfo();
        signIn(response.content, token);
      } catch {
        localStorage.removeItem('token');
        signOut();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [signIn, signOut]);

  const signin = async (email: string, password: string) => {
    const response = await authService.signin({ email, password });
    const { token, user: userData } = response.content;
    signIn(userData, token);
    return response;
  };

  const signup = async (data: Omit<User, 'id' | 'role'>) => {
    const response = await authService.signup(data);
    return response;
  };

  return {
    user,
    isLoading,
    signin,
    signup,
    signout: signOut,
  };
} 