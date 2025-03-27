'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/toast.context';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const { showInfo } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user) {
      showInfo('You are already signed in');
      router.push('/');
    }
  }, [user, router, showInfo, mounted]);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <h1 className="text-rose-500 text-3xl font-bold">airbnb</h1>
        </Link>

        <div className="bg-white p-8 rounded-lg shadow-md w-full">
          <div className="flex gap-4 mb-6">
            <Link
              href="/auth/signin"
              className={`flex-1 text-center py-2 rounded-lg ${
                pathname === '/auth/signin'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className={`flex-1 text-center py-2 rounded-lg ${
                pathname === '/auth/signup'
                  ? 'bg-rose-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
