'use client';

import { useState, useEffect } from 'react';
import { Home, Users, Calendar, MapPin, CreditCard, ArrowUpRight, } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/services/room.service';
import { locationService } from '@/services/location.service';
import { userService } from '@/services/user.service';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Link from 'next/link';
import Image from 'next/image';

interface StatItem {
  name: string;
  value: number;
  href: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  darkColor?: string;
  darkBgColor?: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['admin-rooms-count'],
    queryFn: () => roomService.getRooms(),
  });

  const { data: locationsData, isLoading: isLoadingLocations } = useQuery({
    queryKey: ['admin-locations-count'],
    queryFn: () => locationService.getLocations(),
  });

  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users-count'],
    queryFn: () => userService.getUsers(),
  });

  const isLoading = isLoadingRooms || isLoadingLocations || isLoadingUsers;

  if (!mounted || isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center dark:bg-[#121212]">
        <LoadingSpinner />
      </div>
    );
  }

  const rooms = roomsData?.content || [];
  const locations = locationsData?.content || [];
  const users = usersData?.content || [];

  // Tính tổng doanh thu từ giaTien của các phòng
  const totalRevenue = rooms.reduce((total, room) => total + room.giaTien, 0);

  const stats: StatItem[] = [
    {
      name: 'Vị trí',
      value: locations.length,
      href: '/admin/locations',
      icon: MapPin,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      darkColor: 'dark:text-blue-400',
      darkBgColor: 'dark:bg-blue-900/30',
      change: '+12%',
      changeType: 'increase',
    },
    {
      name: 'Phòng',
      value: rooms.length,
      href: '/admin/rooms',
      icon: Home,
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
      darkColor: 'dark:text-rose-400',
      darkBgColor: 'dark:bg-rose-900/30',
      change: '+18%',
      changeType: 'increase',
    },
    {
      name: 'Người dùng',
      value: users.length,
      href: '/admin/users',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      darkColor: 'dark:text-emerald-400',
      darkBgColor: 'dark:bg-emerald-900/30',
      change: '+7%',
      changeType: 'increase',
    },
    {
      name: 'Doanh thu',
      value: totalRevenue,
      href: '/admin/revenue',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      darkColor: 'dark:text-purple-400',
      darkBgColor: 'dark:bg-purple-900/30',
      change: '+24%',
      changeType: 'increase',
    },
  ];

  

  return (
    <div className="dark:bg-[#121212]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className='mb-4 mt-6 text-center ml-95' >
          <h1 className="text-2xl font-bold text-text-primary dark:text-white">Bảng điều khiển</h1>
          <p className="text-text-secondary dark:text-[#B0B0B0] mt-1">Chào mừng quay trở lại! Dưới đây là tổng quan về hệ thống của bạn.</p>
        </div>
        <div className="mt-2 md:mt-0 px-3 py-2 bg-bg-primary dark:bg-[#1D1D1D] shadow-sm rounded-lg text-sm text-text-secondary dark:text-[#B0B0B0] flex items-center mr-5">
          <Calendar className="h-4 w-4 mr-2 text-primary" />
          {new Date().toLocaleDateString('vi-VN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-bg-primary dark:bg-[#1D1D1D] rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:translate-y-[-2px] dark:shadow-[#383838]/10 border border-border dark:border-[#383838]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-text-secondary dark:text-[#B0B0B0]">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1 text-text-primary dark:text-white">{stat.value.toLocaleString()}</p>
                  
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'increase' ? 'text-success dark:text-[#00C907]' : 'text-warning dark:text-[#E84A35]'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-text-secondary dark:text-[#B0B0B0] ml-1">so với tháng trước</span>
                    </div>
                  )}
                </div>
                <div className={`${stat.bgColor} ${stat.darkBgColor} p-3 rounded-lg ${stat.color} ${stat.darkColor}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-bg-primary dark:bg-[#1D1D1D] rounded-xl shadow-sm p-6 dark:shadow-[#383838]/10 border border-border dark:border-[#383838]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white">Vị trí mới nhất</h2>
            <Link href="/admin/locations" className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-4">
            {locations.slice(0, 5).map((location) => (
              <div key={location.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={`https://picsum.photos/seed/${location.id}/200/200`}
                    alt={location.tenViTri}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate dark:text-white">{location.tenViTri}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{location.tinhThanh}, {location.quocGia}</p>
                </div>
                <Link
                  href={`/admin/locations/${location.id}`}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-primary dark:bg-[#1D1D1D] rounded-xl shadow-sm p-6 dark:shadow-[#383838]/10 border border-border dark:border-[#383838]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white">Phòng đặt nhiều nhất</h2>
            <Link href="/admin/rooms" className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-4">
            {rooms.slice(0, 5).map((room) => (
              <div key={room.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="relative h-12 w-12 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={`https://picsum.photos/seed/${room.id}/200/200`}
                    alt={room.tenPhong}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate dark:text-white">{room.tenPhong}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">${room.giaTien} / đêm</p>
                </div>
                <Link
                  href={`/admin/rooms/${room.id}`}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-primary dark:bg-[#1D1D1D] rounded-xl shadow-sm p-6 dark:shadow-[#383838]/10 border border-border dark:border-[#383838]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-primary dark:text-white">Người dùng mới</h2>
            <Link href="/admin/users" className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors">
              Xem tất cả
            </Link>
          </div>
          
          <div className="space-y-4">
            {users.slice(0, 5).map((user) => (
              <div key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                    alt={user.name}
                    fill
                    className="object-cover"
                    unoptimized={!user.avatar || user.avatar.includes('ui-avatars.com')}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
                <Link
                  href={`/admin/users/${user.id}`}
                  className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-colors"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

     
    </div>
  );
}
