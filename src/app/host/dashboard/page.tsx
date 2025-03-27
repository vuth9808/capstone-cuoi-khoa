'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/services/room.service';
import { Room } from '@/types';
import Link from 'next/link';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  Settings, 
  PlusCircle,
  Loader2,
  Trash
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function HostDashboardPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Lấy danh sách phòng của người dùng hiện tại
  const { data: roomsData, isLoading: isRoomsLoading, refetch: refetchRooms } = useQuery({
    queryKey: ['host-rooms', user?.id],
    queryFn: () => roomService.getRooms(),
    enabled: !!user,
  });

  // Lọc phòng theo mã người dùng
  const userRooms = roomsData?.content
    ? roomsData.content.filter((room: Room) => room.maNguoiDung === user?.id)
    : [];

  // Tính toán thống kê tổng quan
  const totalIncome = userRooms.reduce((total: number, room: Room) => total + room.giaTien, 0);
  const activeRooms = userRooms.length;
  
  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/auth/signin');
    }
  }, [isAuthLoading, user, router]);

  // Xử lý xóa phòng
  const handleDeleteRoom = async (roomId: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      try {
        await roomService.deleteRoom(roomId);
        toast.success('Xóa phòng thành công');
        refetchRooms();
      } catch {
        toast.error('Không thể xóa phòng');
      }
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-rose-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold">Bảng Điều Khiển Chủ Nhà</h1>
            <div className="flex items-center space-x-4">
              <span className="font-medium">{user.name}</span>
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                {user.name?.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-white rounded-lg shadow p-4">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-md ${activeTab === 'overview' ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-50'}`}
              >
                <Home size={18} />
                <span>Tổng quan</span>
              </button>
              <button 
                onClick={() => setActiveTab('rooms')} 
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-md ${activeTab === 'rooms' ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-50'}`}
              >
                <Calendar size={18} />
                <span>Phòng của tôi</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`flex items-center space-x-3 w-full px-4 py-2 rounded-md ${activeTab === 'settings' ? 'bg-rose-50 text-rose-600' : 'hover:bg-gray-50'}`}
              >
                <Settings size={18} />
                <span>Cài đặt</span>
              </button>
            </nav>

            <div className="border-t mt-6 pt-6">
              <Link 
                href="/"
                className="flex items-center space-x-2 text-rose-600 hover:text-rose-700"
              >
                <Home size={18} />
                <span>Trở về trang chủ</span>
              </Link>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                      <h3 className="text-gray-500">Tổng số phòng</h3>
                      <Home className="h-5 w-5 text-rose-600" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{activeRooms}</p>
                    <p className="text-sm text-green-600 mt-2">
                      {activeRooms > 0 ? `${activeRooms} phòng đang hoạt động` : 'Chưa có phòng'}
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between">
                      <h3 className="text-gray-500">Giá trung bình</h3>
                      <DollarSign className="h-5 w-5 text-rose-600" />
                    </div>
                    <p className="text-2xl font-bold mt-2">
                      {activeRooms > 0 
                        ? `${(totalIncome / activeRooms).toLocaleString('vi-VN')}đ` 
                        : '0đ'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Giá / đêm</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Phòng của tôi</h3>
                    <Link 
                      href="/host/rooms/new" 
                      className="flex items-center text-sm text-rose-600 hover:text-rose-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Thêm phòng mới
                    </Link>
                  </div>
                  
                  {isRoomsLoading ? (
                    <div className="flex justify-center p-8">
                      <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                    </div>
                  ) : userRooms.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên phòng</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số khách</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá tiền</th>
                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {userRooms.map((room: Room) => (
                            <tr key={room.id} className="hover:bg-gray-50">
                              <td className="px-3 py-4 text-sm text-gray-900 font-medium">
                                {room.tenPhong}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-900">
                                {room.maViTri}
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-900">{room.khach}</td>
                              <td className="px-3 py-4 text-sm text-gray-900">{room.giaTien.toLocaleString('vi-VN')}đ</td>
                              <td className="px-3 py-4 text-sm text-gray-900">
                                <div className="flex space-x-2">
                                  <Link 
                                    href={`/rooms/${room.id}`}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Xem
                                  </Link>
                                  <button
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    Xóa
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Bạn chưa có phòng nào</p>
                      <Link
                        href="/host/rooms/new"
                        className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                      >
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Đăng ký phòng ngay
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {activeTab === 'rooms' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Phòng của tôi</h2>
                  <Link 
                    href="/host/rooms/new" 
                    className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Thêm phòng mới
                  </Link>
                </div>
                
                {isRoomsLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-rose-600" />
                  </div>
                ) : userRooms.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {userRooms.map((room: Room) => (
                      <div 
                        key={room.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{room.tenPhong}</h3>
                            <p className="text-gray-600 text-sm mt-1">
                              {room.khach} khách • {room.phongNgu} phòng ngủ • {room.phongTam} phòng tắm
                            </p>
                            <p className="text-rose-600 font-medium mt-2">{room.giaTien.toLocaleString('vi-VN')}đ / đêm</p>
                          </div>
                          <div className="flex items-center space-x-3 mt-4 md:mt-0">
                            <Link 
                              href={`/rooms/${room.id}`}
                              className="px-3 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
                            >
                              Xem chi tiết
                            </Link>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="px-3 py-1 border border-red-600 text-red-600 rounded hover:bg-red-50"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="bg-gray-100 inline-flex rounded-full p-4 mb-4">
                      <Home className="h-8 w-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Chưa có phòng nào</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa đăng ký phòng nào trên hệ thống</p>
                    <Link
                      href="/host/rooms/new"
                      className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                    >
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Đăng ký phòng ngay
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-6">Cài đặt tài khoản</h2>
                
                <div className="max-w-md">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên hiển thị
                    </label>
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      disabled
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input 
                      type="tel" 
                      defaultValue={user.phone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    />
                  </div>
                  
                  <button 
                    type="button"
                    className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 