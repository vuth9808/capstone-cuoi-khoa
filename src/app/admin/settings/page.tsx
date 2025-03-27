'use client';

import { useState } from 'react';
import { userService } from '@/services/user.service';
import { toast } from 'react-hot-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, UserPlus, Lock, KeyRound, Settings as SettingsIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';
import LoadingSpinner from '@/components/ui/loading-spinner';

// Schema cho form tạo admin
const adminSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự'),
  phone: z.string().min(10, 'Số điện thoại cần có ít nhất 10 ký tự').optional(),
  birthday: z.string().optional(),
  gender: z.enum(['true', 'false']).default('true'),
  role: z.enum(['ADMIN', 'USER']).default('ADMIN'),
  address: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type AdminFormValues = z.infer<typeof adminSchema>;

export default function AdminSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('admin');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthday: '',
      phone: '',
      gender: 'true',
      role: 'ADMIN',
      address: '',
    },
    mode: 'onChange', // Validate on change for better UX
  });

  // Tạo tài khoản admin
  const createAdminAccount = async (data: AdminFormValues) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Bỏ confirmPassword vì API không cần
      const { ...userData } = data;
      
      // Chuẩn bị dữ liệu để tạo tài khoản admin
      const adminData = {
        ...userData,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name.trim())}`,
        phone: userData.phone || '0000000000',
        birthday: userData.birthday || new Date().toISOString().split('T')[0],
        gender: userData.gender === 'true', // Chuyển đổi string -> boolean
        address: userData.address || '',
        // Đặt role là ADMIN trực tiếp
        role: 'ADMIN' as UserRole
      };
      
      console.log('Đang tạo tài khoản ADMIN với thông tin:', adminData);
      
      try {
        // Trực tiếp tạo tài khoản admin bằng userService.createUser
        const response = await userService.createUser(adminData);
        
        if (response.statusCode === 200) {
          setSuccessMessage(`Tạo tài khoản admin "${userData.name}" thành công!`);
          toast.success(`Tạo tài khoản admin thành công!`);
          
          // Reset form sau khi tạo thành công
          reset();
        } else {
          throw new Error(response.message || 'Không thể tạo tài khoản admin');
        }
      } catch (error: unknown) {
        console.error('Lỗi khi tạo tài khoản admin:', error);
        const errorMsg = error instanceof Error 
          ? error.message 
          : 'Không thể tạo tài khoản admin. Vui lòng thử lại sau.';
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý khi submit form
  const onSubmit = async (data: AdminFormValues) => {
    await createAdminAccount(data);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 text-center">Cài đặt hệ thống</h1>
      
      {/* Tab navigation */}
      <div className="mb-8 border-b">
        <div className="flex flex-wrap space-x-4 md:space-x-8">
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === 'admin'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            <Shield className="mr-2 h-5 w-5" />
            Quản lý Admin
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === 'security'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            <Lock className="mr-2 h-5 w-5" />
            Bảo mật
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-4 font-medium text-sm flex items-center ${
              activeTab === 'general'
                ? 'border-b-2 border-rose-500 text-rose-600'
                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
            }`}
          >
            <SettingsIcon className="mr-2 h-5 w-5" />
            Cài đặt chung
          </button>
        </div>
      </div>

      {activeTab === 'admin' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="bg-rose-100 p-3 rounded-lg text-rose-600 mr-4">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Tạo tài khoản Admin mới</h2>
              <p className="text-gray-500 text-sm">Thêm quản trị viên mới với đầy đủ quyền quản lý hệ thống</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 border border-red-200 bg-red-50 text-red-600 rounded-md flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Lỗi khi tạo tài khoản admin:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 border border-green-200 bg-green-50 text-green-600 rounded-md flex items-start">
              <CheckCircle2 className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Tạo tài khoản thành công!</p>
                <p>{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className={`w-full rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập họ và tên"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className={`w-full rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="admin@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className={`w-full rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập mật khẩu"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword')}
                className={`w-full rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone"
                {...register('phone')}
                className={`w-full rounded-md shadow-sm focus:border-rose-500 focus:ring-rose-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nhập số điện thoại"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh
              </label>
              <input
                type="date"
                id="birthday"
                {...register('birthday')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính
              </label>
              <div className="flex space-x-4 mt-1">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-rose-600"
                    {...register('gender')}
                    value="true"
                    defaultChecked
                  />
                  <span className="ml-2">Nam</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-rose-600"
                    {...register('gender')}
                    value="false"
                  />
                  <span className="ml-2">Nữ</span>
                </label>
              </div>
            </div>

            <div className="hidden">
              <input
                type="hidden"
                {...register('role')}
                value="ADMIN"
              />
              <input
                type="hidden"
                {...register('address')}
                value=""
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <button
                type="submit"
                disabled={isLoading || !isDirty || (isDirty && !isValid)}
                className="w-full md:w-auto flex justify-center items-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  'Tạo tài khoản Admin'
                )}
              </button>
              
              <p className="mt-2 text-xs text-gray-500">
                Lưu ý: Tài khoản admin sẽ có toàn quyền quản lý hệ thống.
              </p>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Cài đặt bảo mật</h2>
              <p className="text-gray-500 text-sm">Quản lý cài đặt bảo mật cho hệ thống của bạn</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-500 text-center py-8">Các tính năng bảo mật sẽ được cập nhật trong phiên bản tiếp theo.</p>
          </div>
        </div>
      )}

      {activeTab === 'general' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4">
              <SettingsIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Cài đặt chung</h2>
              <p className="text-gray-500 text-sm">Quản lý cài đặt chung cho hệ thống của bạn</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-500 text-center py-8">Các tính năng cài đặt chung sẽ được cập nhật trong phiên bản tiếp theo.</p>
          </div>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-xl border p-6">
        <h3 className="font-medium text-gray-900 mb-2">Lưu ý quan trọng</h3>
        <p className="text-gray-600 text-sm">
          Tài khoản admin có quyền quản lý toàn bộ hệ thống. Chỉ cấp quyền này cho những người đáng tin cậy và có trách nhiệm.
          Mọi hành động của admin đều được ghi lại trong nhật ký hệ thống.
        </p>
      </div>
    </div>
  );
} 