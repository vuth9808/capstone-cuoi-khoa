'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Providers from '@/app/providers';
import { InitializeAuth } from '@/components/auth/InitializeAuth';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/theme.context';

interface ClientLayoutProps {
  children: React.ReactNode;
}

// Component này sẽ được bọc trong các providers và có thể sử dụng các hooks
const InnerLayout = ({ children }: ClientLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
    
    // Thêm Animate.css vào DOM
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
    document.head.appendChild(link);
    
    return () => {
      // Cleanup khi component unmount
      document.head.removeChild(link);
    };
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <InitializeAuth />
      {!isAdminPage && <Header />}
      <Toaster 
        position="top-center" 
        toastOptions={{
          // Cấu hình toaster theo theme
          style: {
            background: theme === 'dark' ? 'var(--background-secondary)' : 'var(--background)',
            color: theme === 'dark' ? 'var(--foreground)' : 'var(--foreground)',
            border: `1px solid var(--border)`,
          },
        }}
      />
      <main className="bg-theme-primary text-theme-primary min-h-[calc(100vh-70px)]">
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
};

// Component chính để export, bọc InnerLayout trong các providers
const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <Providers>
      <InnerLayout>{children}</InnerLayout>
    </Providers>
  );
};

export default ClientLayout;
