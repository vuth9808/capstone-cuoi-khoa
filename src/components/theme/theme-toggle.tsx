'use client';

import { useTheme } from '@/contexts/theme.context';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleTheme();
  };

  return (
    <div className="relative">
      <button
        onClick={handleThemeToggle}
        className={`p-2 rounded-full transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-theme-tertiary text-yellow-300 hover:bg-theme-secondary hover:text-yellow-200'
            : 'bg-theme-secondary text-primary hover:bg-theme-tertiary hover:text-primary-hover'
        }`}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        data-testid="theme-toggle"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </button>
      
      {/* {debugInfo && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 p-2 text-xs rounded shadow-lg z-50 w-64">
          {debugInfo}
        </div>
      )} */}
    </div>
  );
} 