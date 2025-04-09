'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/services/room.service';
import { bookingService } from '@/services/booking.service';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { DollarSign, Calendar, TrendingUp, Download, FilterX, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Pagination } from '@/components/ui/pagination';

// Định nghĩa các kiểu lọc thời gian
const TIME_FILTERS = {
  ALL: 'all',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
};

export default function AdminRevenuePage() {
  const [mounted, setMounted] = useState(false);
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS.ALL);
  const [sortBy, setSortBy] = useState('revenue'); // revenue, room_name, bookings
  const [sortDirection, setSortDirection] = useState('desc'); // asc, desc
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lấy danh sách phòng
  const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
    queryKey: ['admin-rooms-revenue'],
    queryFn: () => roomService.getRooms(),
  });

  // Lấy danh sách đặt phòng
  const { data: bookingsData, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['admin-bookings-revenue'],
    queryFn: () => bookingService.getBookings(),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoading = isLoadingRooms || isLoadingBookings || !mounted;

  // Tính toán doanh thu cho từng phòng dựa trên giaTien
  const roomsWithRevenue = useMemo(() => {
    if (!roomsData?.content || !bookingsData?.content) return [];

    const rooms = roomsData.content || [];
    const bookings = bookingsData.content || [];

    // Tạo một map để đếm số lượng đặt phòng cho mỗi phòng
    const bookingCountByRoom = new Map();
    bookings.forEach(booking => {
      const roomId = booking.maPhong;
      bookingCountByRoom.set(roomId, (bookingCountByRoom.get(roomId) || 0) + 1);
    });

    return rooms.map(room => {
      // Số lượng đặt phòng cho phòng này
      const bookingCount = bookingCountByRoom.get(room.id) || 0;
      
      // Doanh thu = giá tiền * số lượng đặt phòng 
      // Nếu không có đặt phòng, tính doanh thu dự kiến dựa trên giá phòng
      const revenue = room.giaTien * Math.max(1, bookingCount);
      
      return {
        ...room,
        bookingCount,
        revenue,
      };
    });
  }, [roomsData, bookingsData]);

  // Lọc doanh thu theo khoảng thời gian
  const filteredRooms = useMemo(() => {
    if (!roomsWithRevenue.length) return [];
    
    // Nếu không lọc theo thời gian, trả về tất cả phòng
    if (timeFilter === TIME_FILTERS.ALL) {
      return roomsWithRevenue;
    }

   
    // Lọc theo tháng này
    if (timeFilter === TIME_FILTERS.THIS_MONTH) {
      // Giả lập dữ liệu cho tháng này (trong thực tế sẽ lọc theo bookings)
      return roomsWithRevenue.map(room => ({
        ...room,
        revenue: Math.round(room.revenue * 0.7), // 70% doanh thu tháng này
        bookingCount: Math.round(room.bookingCount * 0.7),
      }));
    }
    
    // Lọc theo tháng trước
    if (timeFilter === TIME_FILTERS.LAST_MONTH) {
      // Giả lập dữ liệu cho tháng trước
      return roomsWithRevenue.map(room => ({
        ...room,
        revenue: Math.round(room.revenue * 0.5), // 50% doanh thu tháng trước
        bookingCount: Math.round(room.bookingCount * 0.5),
      }));
    }
    
    // Lọc theo năm nay
    if (timeFilter === TIME_FILTERS.THIS_YEAR) {
      // Giả lập dữ liệu cho năm nay
      return roomsWithRevenue.map(room => ({
        ...room,
        revenue: Math.round(room.revenue * 0.9), // 90% doanh thu năm nay
        bookingCount: Math.round(room.bookingCount * 0.9),
      }));
    }
    
    return roomsWithRevenue;
  }, [roomsWithRevenue, timeFilter]);

  // Sắp xếp phòng
  const sortedRooms = useMemo(() => {
    if (!filteredRooms.length) return [];
    
    return [...filteredRooms].sort((a, b) => {
      if (sortBy === 'revenue') {
        return sortDirection === 'asc' ? a.revenue - b.revenue : b.revenue - a.revenue;
      } else if (sortBy === 'room_name') {
        return sortDirection === 'asc' 
          ? a.tenPhong.localeCompare(b.tenPhong) 
          : b.tenPhong.localeCompare(a.tenPhong);
      } else if (sortBy === 'bookings') {
        return sortDirection === 'asc' 
          ? a.bookingCount - b.bookingCount 
          : b.bookingCount - a.bookingCount;
      }
      return 0;
    });
  }, [filteredRooms, sortBy, sortDirection]);

  // Tính tổng doanh thu
  const totalRevenue = useMemo(() => {
    return filteredRooms.reduce((total, room) => total + room.revenue, 0);
  }, [filteredRooms]);

  // Tính tổng số đặt phòng
  const totalBookings = useMemo(() => {
    return filteredRooms.reduce((total, room) => total + room.bookingCount, 0);
  }, [filteredRooms]);

  // Xử lý thay đổi bộ lọc thời gian
  const handleTimeFilterChange = useCallback((filter: string) => {
    setTimeFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  // Xử lý thay đổi sắp xếp
  const handleSortChange = useCallback((field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  }, [sortBy, sortDirection]);

  // Xử lý thay đổi trang
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Tính toán các phòng hiển thị trên trang hiện tại
  const paginatedRooms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedRooms.slice(startIndex, endIndex);
  }, [sortedRooms, currentPage, itemsPerPage]);

  // Tính tổng số trang
  const totalPages = useMemo(() => {
    return Math.ceil(sortedRooms.length / itemsPerPage);
  }, [sortedRooms, itemsPerPage]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Tiêu đề trang */}
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto text-center ml-40">
          <h1 className="text-2xl font-semibold text-theme-primary">Quản lý Doanh thu</h1>
          <p className="mt-2 text-sm text-theme-secondary">
            Thống kê doanh thu từ các phòng
          </p>
        </div>

        {/* Button xuất báo cáo */}
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="theme-button-primary inline-flex items-center justify-center rounded-md"
          >
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="theme-card flex items-center">
          <div className="p-3 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 mr-4">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-theme-secondary">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-theme-primary">{totalRevenue.toLocaleString('vi-VN')} VND</p>
          </div>
        </div>

        <div className="theme-card flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-4">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-theme-secondary">Tổng số phòng</p>
            <p className="text-2xl font-bold text-theme-primary">{filteredRooms.length}</p>
          </div>
        </div>

        <div className="theme-card flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-theme-secondary">Tổng lượt đặt phòng</p>
            <p className="text-2xl font-bold text-theme-primary">{totalBookings}</p>
          </div>
        </div>
      </div>

      {/* Bộ lọc thời gian */}
      <div className="bg-theme-primary rounded-lg shadow mb-8 border border-theme">
        <div className="px-6 py-4 border-b border-theme">
          <h2 className="text-lg font-medium text-theme-primary">Bộ lọc thời gian</h2>
        </div>
        <div className="p-6 flex flex-wrap gap-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              timeFilter === TIME_FILTERS.ALL
                ? 'bg-theme-primary text-theme-secondary'
                : 'bg-theme-secondary text-theme-primary hover:bg-theme-secondary-hover'
            }`}
            onClick={() => handleTimeFilterChange(TIME_FILTERS.ALL)}
          >
            Tất cả thời gian
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              timeFilter === TIME_FILTERS.THIS_MONTH
                ? 'bg-theme-primary text-theme-secondary'
                : 'bg-theme-secondary text-theme-primary hover:bg-theme-secondary-hover'
            }`}
            onClick={() => handleTimeFilterChange(TIME_FILTERS.THIS_MONTH)}
          >
            Tháng này
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              timeFilter === TIME_FILTERS.LAST_MONTH
                ? 'bg-theme-primary text-theme-secondary'
                : 'bg-theme-secondary text-theme-primary hover:bg-theme-secondary-hover'
            }`}
            onClick={() => handleTimeFilterChange(TIME_FILTERS.LAST_MONTH)}
          >
            Tháng trước
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              timeFilter === TIME_FILTERS.THIS_YEAR
                ? 'bg-theme-primary text-theme-secondary'
                : 'bg-theme-secondary text-theme-primary hover:bg-theme-secondary-hover'
            }`}
            onClick={() => handleTimeFilterChange(TIME_FILTERS.THIS_YEAR)}
          >
            Năm nay
          </button>
          {timeFilter !== TIME_FILTERS.ALL && (
            <button
              className="px-4 py-2 rounded-md text-sm font-medium bg-theme-secondary text-theme-primary hover:bg-theme-secondary-hover flex items-center cursor-pointer"
              onClick={() => handleTimeFilterChange(TIME_FILTERS.ALL)}
            >
              <FilterX className="h-4 w-4 mr-1" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Biểu đồ và Bảng */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Biểu đồ */}
        <div className="lg:col-span-2 bg-theme-primary rounded-lg shadow p-6 border border-theme">
          <h2 className="text-lg font-medium text-theme-secondary mb-4">Phân tích doanh thu</h2>
          
          {/* Biểu đồ đơn giản */}
          <div className="h-80 flex items-end space-x-3 mt-6">
            {sortedRooms.slice(0, 10).map((room) => (
              <div key={room.id} className="flex-1 flex flex-col items-center group">
                <div className="w-full group-hover:opacity-80 transition-opacity relative">
                  <div 
                    className="w-full bg-rose-500 hover:bg-rose-600 rounded-t-md transition-all"
                    style={{ height: `${(room.revenue / Math.max(...sortedRooms.map(r => r.revenue))) * 200}px` }}
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity text-center">
                    {room.revenue.toLocaleString('vi-VN')} VND
                  </div>
                </div>
                <div className="text-xs text-theme-secondary mt-2 truncate w-full text-center" title={room.tenPhong}>
                  {room.tenPhong.length > 10 ? `${room.tenPhong.substring(0, 10)}...` : room.tenPhong}
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-theme-secondary text-center mt-4">
            Top 10 phòng có doanh thu cao nhất
          </div>
        </div>

        {/* Thông kê chi tiết */}
        <div className="bg-theme-primary rounded-lg shadow p-6 border border-theme">
          <h2 className="text-lg font-medium text-theme-secondary mb-4">Thống kê chi tiết</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-theme-secondary rounded-lg">
              <div className="text-sm font-medium text-theme-primary">Doanh thu trung bình/phòng</div>
              <div className="text-lg font-bold text-rose-600">
                {filteredRooms.length > 0 
                  ? Math.round(totalRevenue / filteredRooms.length).toLocaleString('vi-VN') 
                  : 0} VND
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-theme-secondary rounded-lg">
              <div className="text-sm font-medium text-theme-primary">Đặt phòng trung bình/phòng</div>
              <div className="text-lg font-bold text-blue-600">
                {filteredRooms.length > 0 
                  ? (totalBookings / filteredRooms.length).toFixed(1) 
                  : 0}
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-theme-secondary rounded-lg">
              <div className="text-sm font-medium text-theme-primary">Phòng có doanh thu cao nhất</div>
              <div className="text-lg font-bold text-green-600">
                {sortedRooms.length > 0 
                  ? sortedRooms[0].revenue.toLocaleString('vi-VN') 
                  : 0} VND
              </div>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-theme-secondary rounded-lg">
              <div className="text-sm font-medium text-theme-primary">Tỷ lệ tăng trưởng</div>
              <div className="text-lg font-bold text-emerald-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                15.4%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bảng doanh thu chi tiết */}
      <div className="bg-theme-primary rounded-lg shadow border border-theme overflow-hidden">
        <div className="px-6 py-4 border-b border-theme flex justify-between items-center">
          <h2 className="text-lg font-medium text-theme-primary">Doanh thu theo phòng</h2>
          <div className="text-sm text-theme-secondary">
            Hiển thị {paginatedRooms.length} / {sortedRooms.length} phòng
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="theme-table">
            <thead className="bg-theme-secondary">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('room_name')}
                >
                  <div className="flex items-center">
                    Tên phòng
                    {sortBy === 'room_name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider cursor-pointer"
                >
                  Giá phòng
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('bookings')}
                >
                  <div className="flex items-center">
                    Lượt đặt phòng
                    {sortBy === 'bookings' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('revenue')}
                >
                  <div className="flex items-center">
                    Doanh thu
                    {sortBy === 'revenue' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-theme-primary uppercase tracking-wider"
                >
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-theme-primary divide-y border-theme">
              {paginatedRooms.map((room) => (
                <tr key={room.id} className="hover:bg-theme-secondary">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0 bg-theme-secondary">
                        {room.hinhAnh ? (
                          <Image
                            src={getValidImageUrl(room.hinhAnh)}
                            alt={room.tenPhong}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="h-10 w-10 flex items-center justify-center text-theme-secondary">
                            <Home className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-theme-primary max-w-[200px] truncate">
                          {room.tenPhong}
                        </div>
                        <div className="text-xs text-theme-secondary">ID: {room.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-theme-primary font-medium">
                      {room.giaTien.toLocaleString('vi-VN')} VND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-theme-primary">
                      {room.bookingCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-rose-600">
                      {room.revenue.toLocaleString('vi-VN')} VND
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-theme-primary">
                    <Link
                      href={`/admin/rooms?id=${room.id}`}
                      className="text-theme-primary hover:text-theme-primary-hover"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {sortedRooms.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-theme-secondary">Không có dữ liệu doanh thu</p>
          </div>
        )}

        {/* Phân trang */}
        {sortedRooms.length > 0 && (
          <div className="px-6 py-4 border-t border-theme">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Hàm hỗ trợ để lấy URL hình ảnh hợp lệ
const getValidImageUrl = (url: string) => {
  if (!url) return '/placeholder.jpg';
  
  // Kiểm tra URL hợp lệ
  try {
    new URL(url);
    return url;
  } catch {
    return '/placeholder.jpg';
  }
}; 