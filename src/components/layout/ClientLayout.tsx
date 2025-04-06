'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import Providers from '@/app/providers';
import { InitializeAuth } from '@/components/auth/InitializeAuth';
import { Toaster } from 'react-hot-toast';
import { usePathname } from 'next/navigation';

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

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
    <Providers>
      <InitializeAuth />
      {!isAdminPage && <Header />}
      <Toaster position="top-center" />
      <main className="bg-bg-primary dark:bg-[#121212] min-h-[calc(100vh-70px)]">{children}</main>
      {!isAdminPage && <Footer />}
    </Providers>
  );
};

export default ClientLayout;
