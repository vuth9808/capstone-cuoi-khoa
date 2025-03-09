"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { createBooking } from '@/services/booking';

interface BookingFormProps {
  roomId: number;
  price: number;
}

const BookingForm: React.FC<BookingFormProps> = ({ roomId, price }) => {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Giả sử user id lấy từ một hook useAuth
  const userId = 1; // Thay thế với ID thực tế từ authentication

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const nights = calculateNights();
  const subtotal = nights * price;
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      setError('Vui lòng chọn ngày nhận phòng và trả phòng');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      await createBooking({
        maPhong: roomId,
        ngayDen: checkIn,
        ngayDi: checkOut,
        soLuongKhach: guests,
        maNguoiDung: userId
      });
      
      router.push('/bookings');
    } catch (error) {
      setError('Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhận phòng</label>
          <Input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trả phòng</label>
          <Input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Khách</label>
        <Input
          type="number"
          min="1"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
        />
      </div>
      
      {nights > 0 && (
        <div className="mb-6 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)} x {nights} đêm</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Phí dịch vụ</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(serviceFee)}</span>
          </div>
          <div className="flex justify-between font-bold pt-3 border-t">
            <span>Tổng</span>
            <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total)}</span>
          </div>
        </div>
      )}
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      
      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="py-3"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Đang xử lý...' : 'Đặt phòng'}
      </Button>
    </form>
  );
};

export default BookingForm;