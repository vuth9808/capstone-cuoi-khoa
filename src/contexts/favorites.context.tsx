'use client';

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

type FavoriteItem = {
  id: number;
  type: 'location' | 'room';
};

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (id: number, type: 'location' | 'room') => void;
  removeFavorite: (id: number, type: 'location' | 'room') => void;
  isFavorite: (id: number, type: 'location' | 'room') => boolean;
  requireAuth: () => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useAuthStore();
  const router = useRouter();
  
  // Tạo key lưu trữ riêng cho mỗi người dùng, sử dụng useCallback để tránh tạo lại hàm
  const getFavoritesKey = useCallback(() => {
    if (!user) return 'guest_favorites';
    return `user_${user.id}_favorites`;
  }, [user]);

  // Load favorites from localStorage on mount và khi user thay đổi
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const favoritesKey = getFavoritesKey();
      const savedFavorites = localStorage.getItem(favoritesKey);
      
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error parsing favorites from localStorage:', error);
          setFavorites([]);
        }
      } else {
        // Reset favorites khi không có dữ liệu cho người dùng hiện tại
        setFavorites([]);
      }
      setIsInitialized(true);
    }
  }, [user, getFavoritesKey]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      const favoritesKey = getFavoritesKey();
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    }
  }, [favorites, isInitialized, user, getFavoritesKey]);

  // Kiểm tra xem người dùng đã đăng nhập chưa, hiển thị thông báo nếu chưa
  const requireAuth = (): boolean => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng này');
      return false;
    }
    return true;
  };

  const addFavorite = (id: number, type: 'location' | 'room') => {
    if (!requireAuth()) {
      router.push('/auth/signin');
      return;
    }
    
    setFavorites(prev => {
      // Check if already in favorites
      if (prev.some(fav => fav.id === id && fav.type === type)) {
        return prev;
      }
      return [...prev, { id, type }];
    });
  };

  const removeFavorite = (id: number, type: 'location' | 'room') => {
    if (!requireAuth()) {
      router.push('/auth/signin');
      return;
    }
    
    setFavorites(prev => 
      prev.filter(fav => !(fav.id === id && fav.type === type))
    );
  };

  const isFavorite = (id: number, type: 'location' | 'room'): boolean => {
    return favorites.some(fav => fav.id === id && fav.type === type);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, requireAuth }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}; 