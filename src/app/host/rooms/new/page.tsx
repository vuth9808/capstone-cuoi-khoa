'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';
import { locationService } from '@/services/location.service';
import { roomService } from '@/services/room.service';
import { useQuery } from '@tanstack/react-query';
import { Location } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

const newRoomSchema = z.object({
  tenPhong: z.string().min(1, 'Vui lòng nhập tên phòng'),
  moTa: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  khach: z.number().min(1, 'Số khách phải lớn hơn 0'),
  phongNgu: z.number().min(1, 'Số phòng ngủ phải lớn hơn 0'),
  giuong: z.number().min(1, 'Số giường phải lớn hơn 0'),
  phongTam: z.number().min(1, 'Số phòng tắm phải lớn hơn 0'),
  giaTien: z.number().min(100000, 'Giá tiền phải lớn hơn 100,000'),
  maViTri: z.number().min(1, 'Vui lòng chọn vị trí'),
  hinhAnh: z.string().url('Vui lòng nhập URL hình ảnh hợp lệ'),
  mayGiat: z.boolean().optional(),
  banLa: z.boolean().optional(),
  tivi: z.boolean().optional(),
  dieuHoa: z.boolean().optional(),
  wifi: z.boolean().optional(),
  bep: z.boolean().optional(),
  doXe: z.boolean().optional(),
  hoBoi: z.boolean().optional(),
  banUi: z.boolean().optional(),
});

type NewRoomFormValues = z.infer<typeof newRoomSchema>;

export default function NewRoomPage() {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['locations'],
    queryFn: () => locationService.getLocations(),
    enabled: !!user,
  });

  const { register, handleSubmit, formState: { errors } } = useForm<NewRoomFormValues>({
    resolver: zodResolver(newRoomSchema),
    defaultValues: {
      tenPhong: '',
      moTa: '',
      khach: 1,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      giaTien: 100000,
      maViTri: undefined,
      hinhAnh: '',
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
    }
  });

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      router.push('/auth/signin');
    }
  }, [isLoadingAuth, user, router]);

  const onSubmit = async (data: NewRoomFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Kiểm tra thông tin người dùng
      if (!user) {
        toast.error('Vui lòng đăng nhập để thực hiện chức năng này');
        router.push('/auth/signin');
        return;
      }

      // Kiểm tra token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        router.push('/auth/signin');
        return;
      }
      
      // Tạo đối tượng dữ liệu phòng với các kiểu dữ liệu rõ ràng
      const roomData = {
        tenPhong: data.tenPhong,
        moTa: data.moTa,
        khach: data.khach,
        phongNgu: data.phongNgu,
        giuong: data.giuong,
        phongTam: data.phongTam,
        giaTien: data.giaTien,
        maViTri: data.maViTri,
        hinhAnh: data.hinhAnh,
        maNguoiDung: user.id,
        // Đảm bảo các giá trị boolean
        mayGiat: !!data.mayGiat,
        banLa: !!data.banLa,
        tivi: !!data.tivi,
        dieuHoa: !!data.dieuHoa,
        wifi: !!data.wifi,
        bep: !!data.bep,
        doXe: !!data.doXe,
        hoBoi: !!data.hoBoi,
        banUi: !!data.banUi,
      };
      
      // Log để debug
      console.log('User info:', user);
      console.log('User role:', user.role);
      console.log('Data to send:', roomData);
      console.log('Token:', token);
      
      // Gọi API tạo phòng mới
      const response = await roomService.createRoom(roomData);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success('Đăng ký phòng thành công!');
        router.push('/host/dashboard');
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra');
      }
    } catch (error: unknown) {
      console.error("Error creating room:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Đã có lỗi xảy ra khi tạo phòng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const locations = locationsData?.content || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link 
            href="/host/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Quay lại bảng điều khiển</span>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Đăng ký phòng mới</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên phòng
                </label>
                <input
                  type="text"
                  {...register('tenPhong')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Nhập tên phòng"
                />
                {errors.tenPhong && (
                  <p className="mt-1 text-sm text-red-600">{errors.tenPhong.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vị trí
                </label>
                <select
                  {...register('maViTri', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  disabled={isLoadingLocations}
                >
                  <option value="">Chọn vị trí</option>
                  {locations.map((location: Location) => (
                    <option key={location.id} value={location.id}>
                      {location.tenViTri}, {location.tinhThanh}
                    </option>
                  ))}
                </select>
                {errors.maViTri && (
                  <p className="mt-1 text-sm text-red-600">{errors.maViTri.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL hình ảnh
                </label>
                <input
                  type="text"
                  {...register('hinhAnh')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.hinhAnh && (
                  <p className="mt-1 text-sm text-red-600">{errors.hinhAnh.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={4}
                  {...register('moTa')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Mô tả chi tiết về phòng"
                />
                {errors.moTa && (
                  <p className="mt-1 text-sm text-red-600">{errors.moTa.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lượng khách tối đa
                </label>
                <input
                  type="number"
                  {...register('khach', { valueAsNumber: true })}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
                {errors.khach && (
                  <p className="mt-1 text-sm text-red-600">{errors.khach.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá tiền / đêm (VNĐ)
                </label>
                <input
                  type="number"
                  {...register('giaTien', { valueAsNumber: true })}
                  min={100000}
                  step={10000}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
                {errors.giaTien && (
                  <p className="mt-1 text-sm text-red-600">{errors.giaTien.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng ngủ
                </label>
                <input
                  type="number"
                  {...register('phongNgu', { valueAsNumber: true })}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
                {errors.phongNgu && (
                  <p className="mt-1 text-sm text-red-600">{errors.phongNgu.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số giường
                </label>
                <input
                  type="number"
                  {...register('giuong', { valueAsNumber: true })}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
                {errors.giuong && (
                  <p className="mt-1 text-sm text-red-600">{errors.giuong.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số phòng tắm
                </label>
                <input
                  type="number"
                  {...register('phongTam', { valueAsNumber: true })}
                  min={1}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                />
                {errors.phongTam && (
                  <p className="mt-1 text-sm text-red-600">{errors.phongTam.message}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Tiện nghi</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('mayGiat')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Máy giặt</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('banLa')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Bàn là</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('tivi')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Tivi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('dieuHoa')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Điều hòa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('wifi')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Wifi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('bep')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Bếp</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('doXe')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Đỗ xe</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('hoBoi')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Hồ bơi</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" {...register('banUi')} className="rounded text-rose-600 focus:ring-rose-500" />
                  <span>Bàn ủi</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                href="/host/dashboard"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Đang xử lý...
                  </span>
                ) : (
                  'Đăng ký phòng'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 