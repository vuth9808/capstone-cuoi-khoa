'use client';

import { useState, useEffect } from 'react';
import { CalendarCheck, ChevronDown, Filter, Search, RefreshCw } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { toast } from 'react-hot-toast';
import { Booking, Room, User } from '@/types';
import Image from 'next/image';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [users, setUsers] = useState<Record<number, User>>({});
  const [rooms, setRooms] = useState<Record<number, Room>>({});

  useEffect(() => {
    // Giả lập dữ liệu
    const dummyData = generateDummyData();
    setBookings(dummyData.bookings);
    setFilteredBookings(dummyData.bookings);
    setUsers(dummyData.users);
    setRooms(dummyData.rooms);
    setIsLoading(false);
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredBookings(bookings);
      return;
    }

    const filtered = bookings.filter(booking => {
      const user = users[booking.maNguoiDung];
      const room = rooms[booking.maPhong];
      
      const searchLower = searchTerm.toLowerCase();
      
      // Tìm kiếm theo ID đặt phòng
      if (booking.id.toString().includes(searchLower)) return true;
      
      // Tìm kiếm theo tên người dùng
      if (user && user.name.toLowerCase().includes(searchLower)) return true;
      
      // Tìm kiếm theo tên phòng
      if (room && room.tenPhong.toLowerCase().includes(searchLower)) return true;
      
      return false;
    });
    
    setFilteredBookings(filtered);
  };

  const handleFilterByStatus = (status: string) => {
    setStatusFilter(status);
    
    if (status === 'all') {
      setFilteredBookings(bookings);
      return;
    }
    
    const filtered = bookings.filter(booking => booking.trangThai === status);
    setFilteredBookings(filtered);
  };

  const handleRefresh = () => {
    toast.success('Đã làm mới dữ liệu');
    // Trong thực tế, sẽ gọi API để lấy dữ liệu mới
    setIsLoading(true);
    setTimeout(() => {
      const dummyData = generateDummyData();
      setBookings(dummyData.bookings);
      setFilteredBookings(dummyData.bookings);
      setUsers(dummyData.users);
      setRooms(dummyData.rooms);
      setIsLoading(false);
    }, 800);
  };

  const handleUpdateStatus = (bookingId: number, newStatus: 'pending' | 'confirmed' | 'cancelled') => {
    // Trong thực tế, sẽ gọi API để cập nhật trạng thái
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? {...booking, trangThai: newStatus} : booking
      )
    );
    
    setFilteredBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId ? {...booking, trangThai: newStatus} : booking
      )
    );
    
    toast.success(`Đã cập nhật trạng thái đặt phòng #${bookingId} thành ${getStatusText(newStatus)}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div className='mb-4 mt-6 text-center ml-120'>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt phòng</h1>
          <p className="text-gray-600 mt-1">Quản lý tất cả các đặt phòng trong hệ thống</p>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 sm:mt-0 flex items-center px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm mb-8">
        <div className="px-6 py-5 border-b flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-2">
            <CalendarCheck className="h-5 w-5 text-rose-500" />
            <h2 className="text-lg font-medium">Danh sách đặt phòng</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                value={statusFilter}
                onChange={(e) => handleFilterByStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Tìm kiếm đặt phòng..."
                className="w-full sm:w-64 pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring-rose-500 focus:border-rose-500"
              />
            </div>
            
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 transition-colors"
            >
              Tìm kiếm
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID đặt phòng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phòng & Khách hàng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số lượng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    Không tìm thấy đặt phòng nào phù hợp với điều kiện tìm kiếm
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const user = users[booking.maNguoiDung];
                  const room = rooms[booking.maPhong];
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 relative rounded-md overflow-hidden">
                            <Image
                              src={room?.hinhAnh || 'https://placehold.co/100x100?text=Room'}
                              alt={room?.tenPhong || 'Phòng'}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{room?.tenPhong || 'Phòng không xác định'}</div>
                            <div className="text-sm text-gray-500">{user?.name || 'Người dùng không xác định'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(booking.ngayDen).toLocaleDateString('vi-VN')} - {new Date(booking.ngayDi).toLocaleDateString('vi-VN')}
                        </div>
                        <div className="text-xs text-gray-500">
                          Đặt vào: {new Date(booking.ngayDat || '').toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.soLuongKhach} khách
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.trangThai)}`}>
                          {getStatusText(booking.trangThai)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          {booking.trangThai === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          
                          {booking.trangThai === 'confirmed' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Hủy
                            </button>
                          )}
                          
                          {booking.trangThai === 'cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Khôi phục
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-medium mb-4">Thống kê đặt phòng</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">{bookings.filter(b => b.trangThai === 'confirmed').length}</div>
            <div className="text-sm text-blue-600 mt-1">Đặt phòng đã xác nhận</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">{bookings.filter(b => b.trangThai === 'pending').length}</div>
            <div className="text-sm text-yellow-600 mt-1">Đặt phòng chờ xác nhận</div>
          </div>
          
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-red-600">{bookings.filter(b => b.trangThai === 'cancelled').length}</div>
            <div className="text-sm text-red-600 mt-1">Đặt phòng đã hủy</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hàm tạo dữ liệu mẫu
function generateDummyData() {
  const users: Record<number, User> = {
    1: {
      id: 1,
      name: 'Nguyễn Văn An',
      email: 'an@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Nguyen+Van+An',
      phone: '0987654321',
      birthday: '1990-01-01',
      gender: true,
      role: 'USER',
    },
    2: {
      id: 2,
      name: 'Trần Thị Bình',
      email: 'binh@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Tran+Thi+Binh',
      phone: '0987654322',
      birthday: '1992-02-02',
      gender: false,
      role: 'USER',
    },
    3: {
      id: 3,
      name: 'Lê Văn Cường',
      email: 'cuong@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Le+Van+Cuong',
      phone: '0987654323',
      birthday: '1985-03-03',
      gender: true,
      role: 'USER',
    },
  };
  
  const rooms: Record<number, Room> = {
    1: {
      id: 1,
      tenPhong: 'Phòng Deluxe Hướng Biển',
      khach: 2,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      moTa: 'Phòng sang trọng với view biển',
      giaTien: 1200000,
      mayGiat: true,
      banLa: true,
      tivi: true,
      dieuHoa: true,
      wifi: true,
      bep: false,
      doXe: true,
      hoBoi: true,
      banUi: true,
      maNguoiDung: 1,
      maViTri: 1,
      hinhAnh: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1470&auto=format&fit=crop',
    },
    2: {
      id: 2,
      tenPhong: 'Căn hộ 2 Phòng ngủ',
      khach: 4,
      phongNgu: 2,
      giuong: 2,
      phongTam: 2,
      moTa: 'Căn hộ rộng rãi thích hợp cho gia đình',
      giaTien: 1800000,
      mayGiat: true,
      banLa: true,
      tivi: true,
      dieuHoa: true,
      wifi: true,
      bep: true,
      doXe: true,
      hoBoi: false,
      banUi: true,
      maNguoiDung: 2,
      maViTri: 2,
      hinhAnh: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1374&auto=format&fit=crop',
    },
    3: {
      id: 3,
      tenPhong: 'Biệt thự Hồ bơi',
      khach: 6,
      phongNgu: 3,
      giuong: 3,
      phongTam: 2,
      moTa: 'Biệt thự sang trọng với hồ bơi riêng',
      giaTien: 3500000,
      mayGiat: true,
      banLa: true,
      tivi: true,
      dieuHoa: true,
      wifi: true,
      bep: true,
      doXe: true,
      hoBoi: true,
      banUi: true,
      maNguoiDung: 3,
      maViTri: 3,
      hinhAnh: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1475&auto=format&fit=crop',
    },
  };
  
  const bookings: Booking[] = [
    {
      id: 1001,
      maPhong: 1,
      ngayDen: '2023-09-10',
      ngayDi: '2023-09-15',
      soLuongKhach: 2,
      maNguoiDung: 1,
      ngayDat: '2023-08-05',
      trangThai: 'confirmed',
    },
    {
      id: 1002,
      maPhong: 2,
      ngayDen: '2023-10-05',
      ngayDi: '2023-10-10',
      soLuongKhach: 3,
      maNguoiDung: 2,
      ngayDat: '2023-09-01',
      trangThai: 'pending',
    },
    {
      id: 1003,
      maPhong: 3,
      ngayDen: '2023-11-20',
      ngayDi: '2023-11-27',
      soLuongKhach: 5,
      maNguoiDung: 3,
      ngayDat: '2023-10-15',
      trangThai: 'confirmed',
    },
    {
      id: 1004,
      maPhong: 1,
      ngayDen: '2023-12-01',
      ngayDi: '2023-12-05',
      soLuongKhach: 2,
      maNguoiDung: 2,
      ngayDat: '2023-11-10',
      trangThai: 'cancelled',
    },
    {
      id: 1005,
      maPhong: 2,
      ngayDen: '2024-01-15',
      ngayDi: '2024-01-20',
      soLuongKhach: 4,
      maNguoiDung: 1,
      ngayDat: '2023-12-20',
      trangThai: 'pending',
    },
    {
      id: 1006,
      maPhong: 3,
      ngayDen: '2024-02-10',
      ngayDi: '2024-02-15',
      soLuongKhach: 6,
      maNguoiDung: 3,
      ngayDat: '2024-01-05',
      trangThai: 'pending',
    },
  ];
  
  return { users, rooms, bookings };
}

// Các hàm tiện ích
function getStatusText(status?: string): string {
  switch (status) {
    case 'pending': return 'Chờ xác nhận';
    case 'confirmed': return 'Đã xác nhận';
    case 'cancelled': return 'Đã hủy';
    default: return 'Không xác định';
  }
}

function getStatusColor(status?: string): string {
  switch (status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'confirmed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
} 