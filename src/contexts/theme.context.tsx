'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Chỉ chạy một lần khi component được mount
  useEffect(() => {
    // Kiểm tra nếu đang ở phía client trước khi truy cập localStorage
    if (typeof window !== 'undefined') {
      try {
        // Kiểm tra nếu người dùng đã có preference về theme
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        
        if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
          setTheme(storedTheme);
        } else {
          // Kiểm tra preference của hệ thống
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const initialTheme = prefersDark ? 'dark' : 'light';
          setTheme(initialTheme);
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
      }
    }
    
    setMounted(true);
  }, []);

  // Effect chạy mỗi khi theme thay đổi
  useEffect(() => {
    // Không thực hiện gì nếu component chưa mount hoặc không phải môi trường client
    if (!mounted || typeof window === 'undefined') return;

    // Thêm hoặc xóa class 'dark' từ thẻ html
    const htmlElement = document.documentElement;
    
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
      // Cập nhật biến CSS để áp dụng dark mode
      document.body.style.backgroundColor = 'var(--background)';
      document.body.style.color = 'var(--foreground)';
    } else {
      htmlElement.classList.remove('dark');
      // Cập nhật biến CSS để áp dụng light mode
      document.body.style.backgroundColor = 'var(--background)';
      document.body.style.color = 'var(--foreground)';
    }
    
    // Cập nhật meta theme-color để phù hợp với theme
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#121212' : '#FFFFFF'
      );
    }

    // Thêm data attribute cho CSS selector
    document.documentElement.setAttribute('data-theme', theme);
    
    // Lưu lựa chọn vào localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  }, [theme, mounted]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Giá trị trả về khi component chưa được mount
  // để tránh hydration mismatch
  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 