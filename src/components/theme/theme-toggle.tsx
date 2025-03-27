'use client';

import { useTheme } from '@/contexts/theme.context';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const handleThemeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Button clicked, toggling theme from:', theme);
    toggleTheme();
  };

  return (
    <div className="relative">
      <button
        onClick={handleThemeToggle}
        className="p-2 rounded-full hover:bg-airbnb-foggy dark:hover:bg-gray-700 transition-colors"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        data-testid="theme-toggle"
      >
        {theme === 'dark' ? (
          <Sun className="h-5 w-5 text-yellow-300" />
        ) : (
          <Moon className="h-5 w-5 text-airbnb-hof" />
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