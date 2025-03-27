'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { authService } from '@/services/auth.service';

const signupSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  birthday: z.string().min(1, 'Vui lòng chọn ngày sinh'),
  gender: z.enum(['true', 'false']),
  avatar: z.string().default('https://ui-avatars.com/api/?name=User'),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      gender: 'true',
      avatar: 'https://ui-avatars.com/api/?name=User',
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    console.log('Form data được gửi đi:', data);
    
    try {
      setIsLoading(true);
      
      // Chuyển đổi gender từ string sang boolean
      const formattedData = {
        ...data,
        gender: data.gender === 'true',
        // Đảm bảo avatar được tạo với tên người dùng
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name.trim())}`,
      };
      
      console.log('Data sau khi format:', formattedData);
      
      const response = await authService.signup(formattedData);
      console.log('API Response:', response);
      
      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      toast.error('Không thể đăng ký. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Đăng ký tài khoản
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Hoặc{' '}
          <Link
            href="/auth/signin"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            đăng nhập nếu đã có tài khoản
          </Link>
        </p>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="rounded-md shadow-sm space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Họ tên
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Số điện thoại
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">
              Ngày sinh
            </label>
            <input
              id="birthday"
              type="date"
              {...register('birthday')}
              className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
            {errors.birthday && (
              <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Giới tính
            </label>
            <div className="mt-1 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('gender')}
                  value="true"
                  className="form-radio text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2">Nam</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  {...register('gender')}
                  value="false"
                  className="form-radio text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-2">Nữ</span>
              </label>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </div>
      </form>
    </div>
  );
}
