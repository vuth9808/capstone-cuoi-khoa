'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { format, differenceInDays } from 'date-fns';
import { toast } from 'react-hot-toast';
import { CalendarDays, MapPin, Users, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { bookingService } from '@/services/booking.service';
import { roomService } from '@/services/room.service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Booking, Room } from '@/types';

type BookingWithRoom = Booking & { room: Room };

export default function BookingList() {
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRoom | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user && !isLoadingAuth) {
      router.push('/auth/signin');
      return;
    }

    const fetchBookings = async () => {
      if (!user) return;

      try {
        const response = await bookingService.getBookingsByUser(user.id);
        const bookingsWithRooms = await Promise.all(
          response.content.map(async (booking) => {
            const roomResponse = await roomService.getRoomById(booking.maPhong);
            return {
              ...booking,
              room: roomResponse.content,
            };
          })
        );
        setBookings(bookingsWithRooms);
      } catch {
        toast.error('Không thể tải danh sách đặt phòng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, isLoadingAuth, router]);

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(selectedBooking.id);
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, trangThai: 'cancelled' }
            : booking
        )
      );
      toast.success('Hủy đặt phòng thành công');
      setShowCancelModal(false);
    } catch {
      toast.error('Không thể hủy đặt phòng');
    } finally {
      setIsCancelling(false);
      setSelectedBooking(null);
    }
  };

  const calculateTotalAmount = (booking: BookingWithRoom) => {
    const numberOfDays = differenceInDays(
      new Date(booking.ngayDi),
      new Date(booking.ngayDen)
    );
    return booking.room.giaTien * numberOfDays;
  };

  // Sắp xếp theo thời gian tạo mới nhất (giả sử id lớn hơn = tạo sau)
  const sortedBookings = [...bookings].sort((a, b) => b.id - a.id);

  if (isLoadingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      {sortedBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="flex flex-col items-center gap-4">
            <CalendarDays className="h-12 w-12 text-gray-400" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Chưa có đặt phòng nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bắt đầu tìm kiếm và đặt phòng ngay!
              </p>
            </div>
            <Button
              onClick={() => router.push('/')}
              className="bg-rose-600 hover:bg-rose-700"
            >
              Xem danh sách phòng
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div 
                    className="relative h-48 md:h-32 md:w-48 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => router.push(`/rooms/${booking.room.id}`)}
                  >
                    <Image
                      src={booking.room.hinhAnh || '/placeholder.png'}
                      alt={booking.room.tenPhong}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div>
                        <h3 
                          className="text-lg font-semibold text-gray-900 hover:text-rose-600 cursor-pointer" 
                          onClick={() => router.push(`/rooms/${booking.room.id}`)}
                        >
                          {booking.room.tenPhong}
                        </h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="line-clamp-1">{booking.room.diaChi}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-rose-600">
                          {calculateTotalAmount(booking).toLocaleString('vi-VN')}đ
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.room.giaTien.toLocaleString('vi-VN')}đ × {differenceInDays(new Date(booking.ngayDi), new Date(booking.ngayDen))} đêm
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {format(new Date(booking.ngayDen), 'dd/MM/yyyy')}
                          </p>
                          <p className="text-gray-500">Nhận phòng</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <CalendarDays className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {format(new Date(booking.ngayDi), 'dd/MM/yyyy')}
                          </p>
                          <p className="text-gray-500">Trả phòng</p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {booking.soLuongKhach} người
                          </p>
                          <p className="text-gray-500">Số khách</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.trangThai === 'confirmed' 
                              ? 'bg-green-100 text-green-800' 
                              : booking.trangThai === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : booking.trangThai === 'cancelled' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {booking.trangThai === 'confirmed' 
                            ? 'Đã xác nhận' 
                            : booking.trangThai === 'pending' 
                            ? 'Đang xử lý' 
                            : booking.trangThai === 'cancelled' 
                            ? 'Đã hủy' 
                            : 'Đã xác nhận'}
                        </span>
                        <span className="text-sm text-gray-500">
                          Đặt ngày: {format(new Date(booking.ngayDat || new Date()), 'dd/MM/yyyy')}
                        </span>
                      </div>
                      {booking.trangThai !== 'cancelled' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowCancelModal(true);
                          }}
                        >
                          Hủy đặt phòng
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Xác nhận hủy đặt phòng
            </DialogTitle>
            <DialogDescription className="space-y-3 pt-3">
              <p>
                Bạn có chắc chắn muốn hủy đặt phòng này? Thao tác này không thể hoàn tác.
              </p>
              {selectedBooking && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm space-y-2">
                  <p>
                    <span className="font-medium">Phòng:</span> {selectedBooking.room.tenPhong}
                  </p>
                  <p>
                    <span className="font-medium">Ngày đến:</span> {format(new Date(selectedBooking.ngayDen), 'dd/MM/yyyy')}
                  </p>
                  <p>
                    <span className="font-medium">Ngày đi:</span> {format(new Date(selectedBooking.ngayDi), 'dd/MM/yyyy')}
                  </p>
                  <p>
                    <span className="font-medium">Số đêm:</span> {differenceInDays(new Date(selectedBooking.ngayDi), new Date(selectedBooking.ngayDen))} đêm
                  </p>
                  <p>
                    <span className="font-medium">Giá mỗi đêm:</span> {selectedBooking.room.giaTien.toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-rose-600 font-medium">
                    <span className="font-medium text-gray-900">Tổng tiền hoàn trả:</span> {calculateTotalAmount(selectedBooking).toLocaleString('vi-VN')}đ
                  </p>
                  <p className="text-xs text-muted-foreground">
                    * Số tiền sẽ được hoàn trả trong vòng 7 ngày làm việc
                  </p>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowCancelModal(false);
                setSelectedBooking(null);
              }}
              disabled={isCancelling}
            >
              Giữ đặt phòng
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelBooking}
              disabled={isCancelling}
              className="gap-2"
            >
              {isCancelling ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full inline-block animate-spin" />
                  Đang hủy...
                </>
              ) : (
                'Xác nhận hủy'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 