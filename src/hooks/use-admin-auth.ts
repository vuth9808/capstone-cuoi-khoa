'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export function useAdminAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAdmin } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  
  // Xác định nếu đang ở trang đăng nhập admin
  const isAuthPage = pathname === '/admin/auth';

  useEffect(() => {
    let mounted = true;

    const checkAuth = () => {
      // Nếu đang ở trang auth, không cần kiểm tra
      if (isAuthPage) {
        if (mounted) {
          setIsChecking(false);
        }
        return;
      }
      
      // Kiểm tra token và user
      if (!token || !user) {
        router.push('/admin/auth');
        return;
      }

      // Kiểm tra quyền admin
      if (!isAdmin) {
        console.warn('Access denied: User is not an admin');
        router.push('/admin/auth');
        return;
      }

      if (mounted) {
        setIsChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAuth, 300);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, [router, user, token, isAdmin, pathname, isAuthPage]);

  return {
    user,
    isAdmin: !!isAdmin,
    isChecking,
  };
}