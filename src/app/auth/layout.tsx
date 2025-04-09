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
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[url(https://media.cntraveler.com/photos/5d112d50c4d7bd806dbc00a4/16:9/w_2560%2Cc_limit/airbnb%2520luxe.jpg)] bg-center bg-cover">
  
  {/* Overlay gradient/màu tối */}
  <div className="absolute inset-0 bg-black/30" />

  {/* Nội dung chính */}
  <div className="relative z-10 w-full max-w-md">
    <div className="bg-white p-8 rounded-lg shadow-md w-full">
      <div className="flex gap-4 mb-6">
        <Link
          href="/auth/signin"
          className={`flex-1 text-center py-2 rounded-lg ${
            pathname === '/auth/signin'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Đăng nhập
        </Link>
        <Link
          href="/auth/signup"
          className={`flex-1 text-center py-2 rounded-lg ${
            pathname === '/auth/signup'
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Đăng ký
        </Link>
      </div>

      {children}
    </div>
  </div>
</div>

  );
}
