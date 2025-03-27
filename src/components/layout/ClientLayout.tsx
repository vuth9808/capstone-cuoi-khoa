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
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Providers>
      <InitializeAuth />
      {!isAdminPage && <Header />}
      <Toaster position="top-center" />
      <main className=" min-h-[calc(100vh-70px)]">{children}</main>
      {!isAdminPage && <Footer />}
    </Providers>
  );
};

export default ClientLayout;
