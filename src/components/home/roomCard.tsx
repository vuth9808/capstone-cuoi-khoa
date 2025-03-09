import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar } from 'react-icons/fa';
import { Room } from '@/types/room';

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    <Link href={`/rooms/${room.id}`}>
      <div className="group cursor-pointer">
        <div className="relative aspect-square overflow-hidden rounded-xl">
          <Image
            src={room.hinhAnh || '/images/placeholder.jpg'}
            alt={room.tenPhong}
            fill
            className="object-cover group-hover:scale-110 transition h-full w-full"
          />
        </div>
        
        <div className="mt-3">
          <div className="flex justify-between">
            <h3 className="font-semibold text-lg truncate">{room.tenPhong}</h3>
            <div className="flex items-center">
              <FaStar className="text-rose-500 mr-1" />
              <span>{room.danhGia}</span>
            </div>
          </div>
          
          <p className="text-gray-500 mt-1 truncate">{`${room.phongNgu} phòng ngủ · ${room.phongTam} phòng tắm`}</p>
          <p className="font-semibold mt-2">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.giaTien)}
            <span className="font-normal text-gray-600"> / đêm</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RoomCard;