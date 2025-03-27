'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';
import { Shield, LogIn } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuthStore } from '@/store/auth.store';

const adminSigninSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type AdminSigninFormData = z.infer<typeof adminSigninSchema>;

export default function AdminAuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { signin } = useAuth();
  const { user, isAdmin } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');

  // Kiểm tra nếu đã đăng nhập là admin, tự động chuyển trang
  useEffect(() => {
    if (user && isAdmin) {
      router.push('/admin');
    }
  }, [user, isAdmin, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminSigninFormData>({
    resolver: zodResolver(adminSigninSchema),
  });

  const onSubmit = async (data: AdminSigninFormData) => {
    try {
      setIsLoading(true);
      const response = await signin(data.email, data.password);
      
      // Kiểm tra vai trò người dùng
      if (response.content.user.role !== 'ADMIN') {
        toast.error('Bạn không có quyền truy cập trang quản trị.');
        // Đăng xuất nếu không phải admin
        useAuthStore.getState().signOut();
        return;
      }
      
      toast.success('Đăng nhập thành công!');
      setIsRedirecting(true);
      router.push('/admin');
    } catch (error: unknown) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Nếu đang kiểm tra hoặc đã đăng nhập là admin, hiển thị trạng thái chuyển hướng
  if (isRedirecting || (user && isAdmin)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <LoadingSpinner className="mx-auto h-12 w-12 mb-4" />
          <h2 className="text-xl font-medium text-gray-900">Đang chuyển hướng...</h2>
          <p className="mt-2 text-sm text-gray-600">Vui lòng đợi trong giây lát</p>
          
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
          >
            <LogIn className="h-4 w-4 mr-2" />
            Vào trang quản trị
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="bg-rose-100 p-3 rounded-full">
              <Shield className="h-12 w-12 text-rose-600" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập quản trị
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Trang này dành riêng cho quản trị viên
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                {...register('password')}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                placeholder="Mật khẩu"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="h-4 w-4 mr-2" />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </div>
        </form>
        
        <div className="rounded-md bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <LogIn className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Lưu ý</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  Đây là khu vực dành riêng cho quản trị viên. Nếu bạn không phải quản trị viên, vui lòng quay lại trang người dùng.
                </p>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
} 