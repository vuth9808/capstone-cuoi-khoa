'use client';

import { useTheme } from '@/contexts/theme.context';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className={`p-2 text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white rounded-full hover:bg-bg-secondary dark:hover:bg-[#2A2A2A] transition-colors ${className}`}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
} 