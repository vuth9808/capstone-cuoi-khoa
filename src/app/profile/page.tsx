'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';
import { userService } from '@/services/user.service';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

// Schema cho form chỉnh sửa thông tin
const updateProfileSchema = z.object({
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().regex(/^[0-9]{10}$/, 'Số điện thoại không hợp lệ'),
  birthday: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= 18;
  }, 'Bạn phải đủ 18 tuổi'),
  gender: z.boolean(),
  address: z.string().optional(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, signout } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      birthday: user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '',
      gender: user?.gender || false,
      address: user?.address || '',
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!user) {
    router.push('/auth/signin');
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!selectedFile) return;

    try {
      setIsUpdating(true);
      await userService.updateAvatar(user.id, selectedFile);
      toast.success('Cập nhật ảnh đại diện thành công!');
      // Refresh the page to see the new avatar
      window.location.reload();
    } catch {
      toast.error('Không thể cập nhật ảnh đại diện');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = () => {
    signout();
    router.push('/');
  };

  const onSubmit = async (data: UpdateProfileFormValues) => {
    try {
      setIsUpdating(true);
      const response = await userService.updateUser(user.id, data);
      if (response.statusCode === 200) {
        toast.success('Cập nhật thông tin thành công!');
        setIsEditing(false);
        // Refresh để cập nhật thông tin mới
        window.location.reload();
      } else {
        throw new Error(response.message);
      }
    } catch {
      toast.error('Không thể cập nhật thông tin. Vui lòng thử lại sau.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-6">
              <div className="relative h-24 w-24">
                <Image
                  src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name.trim())}
                  alt={user.name}
                  fill
                  priority
                  sizes="96px"
                  className="rounded-full object-cover"
                  unoptimized={!user.avatar || user.avatar.includes('ui-avatars.com')}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Thông tin cá nhân</h3>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Chỉnh sửa
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Họ tên</label>
                    <input
                      type="text"
                      {...register('name')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="tel"
                      {...register('phone')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
                    <input
                      type="date"
                      {...register('birthday')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                    {errors.birthday && (
                      <p className="mt-1 text-sm text-red-600">{errors.birthday.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Giới tính</label>
                    <select
                      {...register('gender')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    >
                      <option value="true">Nam</option>
                      <option value="false">Nữ</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      {...register('address')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                    >
                      {isUpdating ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Đang cập nhật...
                        </>
                      ) : (
                        'Lưu thay đổi'
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Họ tên
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày sinh
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.birthday).toLocaleDateString('vi-VN')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Giới tính
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.gender ? 'Nam' : 'Nữ'}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {user.address || 'Chưa cập nhật'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <div>
                <label
                  htmlFor="avatar"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ảnh đại diện mới
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                  />
                  <button
                    type="button"
                    onClick={handleUpdateAvatar}
                    disabled={!selectedFile || isUpdating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                  >
                    {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
