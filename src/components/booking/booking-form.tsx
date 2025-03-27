'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { bookingService } from '@/services/booking.service';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';

const bookingSchema = z.object({
  ngayDen: z.string().min(1, 'Vui lòng chọn ngày đến'),
  ngayDi: z.string().min(1, 'Vui lòng chọn ngày đi'),
  soLuongKhach: z.number().min(1, 'Số lượng khách phải lớn hơn 0'),
  maNguoiDung: z.number(),
  maPhong: z.number(),
  paymentMethod: z.enum(['momo'], { required_error: 'Vui lòng chọn phương thức thanh toán' }),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingRequest {
  maPhong: number;
  maNguoiDung: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  trangThai?: string;
}

interface BookingFormProps {
  roomId: number;
  userId?: number;
  maxGuests: number;
  price: number;
  onSuccess?: () => void;
  onError?: () => void;
}

export default function BookingForm({
  roomId,
  userId,
  maxGuests,
  price,
  onSuccess = () => {},
  onError = () => {},
}: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();
  const actualUserId = userId || (user?.id || 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      maNguoiDung: actualUserId,
      maPhong: roomId,
      soLuongKhach: 1,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    // Kiểm tra người dùng đã đăng nhập chưa
    if (!user) {
      toast.error('Bạn cần đăng nhập để đặt phòng');
      router.push('/auth/signin');
      return;
    }

    try {
      setIsLoading(true);

      if (data.paymentMethod === 'momo') {
        // Tạo đơn hàng trong database
        const bookingData: BookingRequest = {
          ...data,
          trangThai: 'pending'
        };
        await bookingService.createBooking(bookingData);

        // Tạo thanh toán MoMo
        const orderId = `ORDER_${Date.now()}`;
        const amount = calculateTotalAmount(data.ngayDen, data.ngayDi);
        const orderInfo = `Đặt phòng ${roomId}`;

        const response = await fetch('/api/payment/momo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderId,
            amount,
            orderInfo,
          }),
        });

        const momoResponse = await response.json();

        if (momoResponse.payUrl) {
          // Chuyển hướng đến trang thanh toán MoMo
          window.location.href = momoResponse.payUrl;
        } else {
          throw new Error('Không thể tạo thanh toán MoMo');
        }
      } else {
        // Xử lý các phương thức thanh toán khác ở đây
        const bookingData: BookingRequest = {
          ...data,
          trangThai: 'confirmed'
        };
        const response = await bookingService.createBooking(bookingData);

        if (response) {
          onSuccess();
          router.push('/bookings');
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      onError();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalAmount = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * price;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ngày đến
        </label>
        <input
          type="date"
          {...register('ngayDen')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.ngayDen && (
          <p className="mt-1 text-sm text-red-600">{errors.ngayDen.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ngày đi
        </label>
        <input
          type="date"
          {...register('ngayDi')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
          min={new Date().toISOString().split('T')[0]}
        />
        {errors.ngayDi && (
          <p className="mt-1 text-sm text-red-600">{errors.ngayDi.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Số lượng khách
        </label>
        <input
          type="number"
          {...register('soLuongKhach', { valueAsNumber: true })}
          min={1}
          max={maxGuests}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
        />
        {errors.soLuongKhach && (
          <p className="mt-1 text-sm text-red-600">
            {errors.soLuongKhach.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phương thức thanh toán
        </label>
        <div className="mt-2 space-y-2">
          <div className="flex items-center">
            <input
              type="radio"
              value="momo"
              {...register('paymentMethod')}
              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300"
            />
            <label className="ml-3 block text-sm font-medium text-gray-700">
              Thanh toán qua MoMo
            </label>
          </div>
        </div>
        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-600">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      {user ? (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
        >
          {isLoading ? 'Đang xử lý...' : 'Đặt phòng'}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-center text-rose-600 font-medium">
            Bạn cần đăng nhập để đặt phòng
          </div>
          <Link
            href="/auth/signin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Đăng nhập
          </Link>
        </div>
      )}
    </form>
  );
}
