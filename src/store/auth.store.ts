import { create } from 'zustand';
import { User } from '@/types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  token: string | null;
  isAdmin: boolean;
  isInitialized: boolean;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  initializeFromStorage: () => void;
}

const getStoredToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('token') || null;
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = Cookies.get('user');
  if (!userStr) return null;
  try {
    return JSON.parse(decodeURIComponent(userStr)) as User;
  } catch {
    return null;
  }
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAdmin: false,
  isInitialized: false,
  signIn: (user: User, token: string) => {
    Cookies.set('token', token, { expires: 7 });
    Cookies.set('user', encodeURIComponent(JSON.stringify(user)), { expires: 7 });
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({ user, token, isAdmin: user.role === 'ADMIN' });
  },
  signOut: () => {
    Cookies.remove('token');
    Cookies.remove('user');
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    set({ user: null, token: null, isAdmin: false });
  },
  initializeFromStorage: () => {
    const token = getStoredToken();
    const user = getStoredUser();
    set({ 
      token,
      user,
      isAdmin: user?.role === 'ADMIN' || false,
      isInitialized: true,
    });
  },
}));
