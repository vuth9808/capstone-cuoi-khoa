"use client"
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { FaStar, FaHome, FaDoorOpen, FaBed, FaBath, FaWifi, FaTv, FaSwimmingPool } from 'react-icons/fa';
import { Room } from '@/types/room';
import { getRoomById } from '@/services/room';
import BookingForm from './bookingForm';

interface RoomDetailProps {
  room?: Room;
}

const RoomDetail: React.FC<RoomDetailProps> = ({ room: initialRoom }) => {
  const params = useParams();
  const id = params?.id;
  const [room, setRoom] = useState<Room | null>(initialRoom || null);
  const [loading, setLoading] = useState(!initialRoom && !!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialRoom && id) {
      setLoading(true);
      const roomId = Array.isArray(id) ? id[0] : id;
      
      getRoomById(roomId)
        .then((data) => {
          setRoom(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Lỗi lấy dữ liệu phòng:', err);
          setError('Không thể tải thông tin phòng. Vui lòng thử lại sau.');
          setLoading(false);
        });
    }
  }, [id, initialRoom]);

  if (loading) return <div className="container mx-auto px-4 py-8 text-center">Đang tải...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-center text-red-500">{error}</div>;
  if (!room) return <div className="container mx-auto px-4 py-8 text-center">Không tìm thấy thông tin phòng</div>;

  // Ensure values have defaults for safer rendering
  const {
    tenPhong = 'Phòng không tên',
    hinhAnh = '/images/placeholder.jpg',
    danhGia = 0,
    khach = 0,
    phongNgu = 0,
    giuong = 0,
    phongTam = 0,
    moTa = '',
    giaTien = 0,
    wifi = false,
    tivi = false,
    dieuHoa = false,
    bep = false,
    mayGiat = false,
    banLa = false,
    hoBoi = false,
    doXe = false
  } = room;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{tenPhong}</h1>

      <div className="flex items-center mb-6">
        <div className="flex items-center mr-4">
          <FaStar className="text-rose-500 mr-1" />
          <span className="font-semibold">{danhGia}</span>
        </div>
        <span className="text-gray-500">·</span>
        <span className="ml-4 text-gray-600 underline">12 đánh giá</span>
      </div>

      {/* Hình ảnh phòng */}
      <div className="relative w-full h-96 md:h-[500px] mb-8 overflow-hidden rounded-xl">
        <Image
          src={hinhAnh}
          alt={tenPhong}
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {/* Thông tin chung */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Toàn bộ căn hộ</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <FaHome className="mr-2 text-gray-500" />
                <span>{khach} khách</span>
              </div>
              <div className="flex items-center">
                <FaDoorOpen className="mr-2 text-gray-500" />
                <span>{phongNgu} phòng ngủ</span>
              </div>
              <div className="flex items-center">
                <FaBed className="mr-2 text-gray-500" />
                <span>{giuong} giường</span>
              </div>
              <div className="flex items-center">
                <FaBath className="mr-2 text-gray-500" />
                <span>{phongTam} phòng tắm</span>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Mô tả</h2>
            <p className="text-gray-600 whitespace-pre-line">{moTa}</p>
          </div>

          {/* Tiện nghi */}
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Tiện nghi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wifi && (
                <div className="flex items-center">
                  <FaWifi className="mr-3 text-gray-500" />
                  <span>Wifi</span>
                </div>
              )}
              {tivi && (
                <div className="flex items-center">
                  <FaTv className="mr-3 text-gray-500" />
                  <span>TV</span>
                </div>
              )}
              {dieuHoa && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">🧊</span>
                  <span>Điều hòa</span>
                </div>
              )}
              {bep && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">🍳</span>
                  <span>Bếp</span>
                </div>
              )}
              {mayGiat && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">🧺</span>
                  <span>Máy giặt</span>
                </div>
              )}
              {banLa && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">👔</span>
                  <span>Bàn là</span>
                </div>
              )}
              {hoBoi && (
                <div className="flex items-center">
                  <FaSwimmingPool className="mr-3 text-gray-500" />
                  <span>Hồ bơi</span>
                </div>
              )}
              {doXe && (
                <div className="flex items-center">
                  <span className="mr-3 text-gray-500">🚗</span>
                  <span>Chỗ đỗ xe</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Phần đặt phòng */}
        <div>
          <div className="sticky top-32 bg-white rounded-xl border p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-2xl font-bold">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(giaTien)}
                </span>
                <span className="text-gray-600"> / đêm</span>
              </div>
              <div className="flex items-center">
                <FaStar className="text-rose-500 mr-1" />
                <span>{danhGia}</span>
              </div>
            </div>

            <BookingForm roomId={Number(room.id) || 0} price={giaTien} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;