'use client';

import { useState, useEffect } from 'react';
import { Home, Users, Calendar, MapPin, CreditCard, ArrowUpRight, Bookmark, Activity, Star, User as UserIcon } from 'lucide-react';
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
      <div className="min-h-[50vh] flex items-center justify-center dark:bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  const rooms = roomsData?.content || [];
  const locations = locationsData?.content || [];
  const users = usersData?.content || [];

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
      value: rooms.length * 120,
      href: '#',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      darkColor: 'dark:text-purple-400',
      darkBgColor: 'dark:bg-purple-900/30',
      change: '+24%',
      changeType: 'increase',
    },
  ];

  // Đưa ra dữ liệu mẫu cho biểu đồ doanh thu
  const chartData = {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    values: [18, 35, 25, 45, 40, 60, 70],
  };

  return (
    <div className="dark:bg-gray-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div className='mb-4 mt-6 text-center ml-95' >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bảng điều khiển</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">Chào mừng quay trở lại! Dưới đây là tổng quan về hệ thống của bạn.</p>
        </div>
        <div className="mt-2 md:mt-0 px-3 py-2 bg-white dark:bg-gray-800 shadow-sm rounded-lg text-sm text-gray-500 dark:text-gray-300 flex items-center mr-5">
          <Calendar className="h-4 w-4 mr-2 text-rose-500" />
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
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:translate-y-[-2px] dark:shadow-gray-800/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1 dark:text-white">{stat.value.toLocaleString()}</p>
                  
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <span className={`text-xs font-medium ${
                        stat.changeType === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">so với tháng trước</span>
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 lg:col-span-2 dark:shadow-gray-800/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold dark:text-white">Doanh thu theo thời gian</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Ngày</button>
              <button className="px-3 py-1 text-sm bg-rose-500 text-white rounded-md">Tuần</button>
              <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600">Tháng</button>
            </div>
          </div>
          
          {/* Simple bar chart representation */}
          <div className="h-64 flex items-end space-x-6 px-4">
            {chartData.labels.map((label, index) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full bg-rose-500 hover:bg-rose-600 rounded-t-md transition-all" 
                  style={{ height: `${chartData.values[index]}%` }}
                />
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Biểu đồ doanh thu 7 ngày gần nhất (đơn vị: triệu VNĐ)
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 dark:shadow-gray-800/10">
          <h2 className="text-lg font-semibold mb-4 dark:text-white">Hoạt động mới nhất</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 p-2 rounded-md">
                <UserIcon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Người dùng mới đăng ký</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hôm nay lúc 10:30</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-md">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Đặt phòng mới #2481</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hôm nay lúc 09:15</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-2 rounded-md">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Đánh giá 5 sao mới</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hôm qua lúc 16:20</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-md">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium dark:text-white">Đăng phòng mới</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Hôm qua lúc 12:40</p>
              </div>
            </div>
          </div>
          
          <button className="mt-6 w-full py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 dark:shadow-gray-800/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Vị trí mới nhất</h2>
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 dark:shadow-gray-800/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Phòng đặt nhiều nhất</h2>
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 dark:shadow-gray-800/10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Người dùng mới</h2>
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8 dark:shadow-gray-800/10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold dark:text-white">Thống kê hệ thống</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Tổng quan về hiệu suất của hệ thống.</p>
          </div>
          <div className="mt-2 md:mt-0">
            <select className="px-4 py-2 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-lg text-sm border-0 focus:ring-2 focus:ring-rose-500">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
              <option>3 tháng qua</option>
              <option>6 tháng qua</option>
              <option>1 năm qua</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ đặt phòng</h3>
              <span className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs px-2 py-1 rounded-full">+12.5%</span>
            </div>
            <p className="text-2xl font-bold mt-2 dark:text-white">68.54%</p>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-green-500 rounded-full" style={{ width: '68.54%' }}></div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Thời gian lưu trú TB</h3>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-xs px-2 py-1 rounded-full">+3.2%</span>
            </div>
            <p className="text-2xl font-bold mt-2 dark:text-white">3.4 ngày</p>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-amber-500 rounded-full" style={{ width: '34%' }}></div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ hủy đặt phòng</h3>
              <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs px-2 py-1 rounded-full">-2.3%</span>
            </div>
            <p className="text-2xl font-bold mt-2 dark:text-white">4.8%</p>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-rose-500 rounded-full" style={{ width: '4.8%' }}></div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Đánh giá trung bình</h3>
              <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-full">+0.2</span>
            </div>
            <p className="text-2xl font-bold mt-2 dark:text-white">4.7 / 5</p>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-600 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full" style={{ width: '94%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
