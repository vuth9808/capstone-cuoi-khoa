'use client';

import { PropsWithChildren } from 'react';
import { Toaster } from 'react-hot-toast';
import { ToastProvider } from '@/contexts/toast.context';
import { FavoritesProvider } from '@/contexts/favorites.context';
import { ThemeProvider } from '@/contexts/theme.context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ThemeProvider>
          <FavoritesProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
                success: {
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </FavoritesProvider>
        </ThemeProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
