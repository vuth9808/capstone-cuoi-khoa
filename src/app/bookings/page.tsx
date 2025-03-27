'use client';

import BookingList from '@/components/booking/booking-list';

export default function BookingsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Danh sách đặt phòng của bạn</h1>
      <BookingList />
    </div>
  );
}
