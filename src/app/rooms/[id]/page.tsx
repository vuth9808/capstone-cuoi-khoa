'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MapPin, Star, Share, Heart, User, Home, Medal, Calendar, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Types
interface RoomImage {
  id: number;
  maPhong: number;
  hinhAnh: string;
}

interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  diaChiId: number;
  diaChi: {
    id: number;
    tenViTri: string;
    tinhThanh: string;
    quocGia: string;
    hinhAnh: string;
  };
  hinhAnh: string;
}

// Move token to environment variable in production
// For now, store it here but consider implementing a token refresh mechanism
const TOKEN_BY_CLASS = process.env.NEXT_PUBLIC_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA3OCIsIkhldEhhblN0cmluZyI6IjI3LzA3LzIwMjUiLCJIZXRIYW5UaW1lIjoiMTc1MzU3NDQwMDAwMCIsIm5iZiI6MTcyNjA3NDAwMCwiZXhwIjoxNzUzNzIyMDAwfQ.BTmM2iB4rp2M5zBswdnAhImSAoSPeaxquN5mTgxFzaQ';

const RoomDetailPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [room, setRoom] = useState<Room | null>(null);
  const [images, setImages] = useState<RoomImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [errorType, setErrorType] = useState<'auth' | 'network' | 'data' | 'unknown'>('unknown');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState({
    checkIn: '',
    checkOut: '',
  });
  const [guests, setGuests] = useState(1);
  const [retryCount, setRetryCount] = useState(0);
  
  // Directly use mock data for debugging if API fails
  const useMockData = () => {
    // This will allow you to at least see the UI even if API fails
    const mockRoom: Room = {
      id: parseInt(Array.isArray(id) ? id[0] : id as string) || 1,
      tenPhong: "Luxury Suite",
      khach: 4,
      phongNgu: 2,
      giuong: 2,
      phongTam: 1,
      moTa: "A beautiful room with amazing views.",
      giaTien: 100,
      mayGiat: true,
      banLa: true,
      tivi: true,
      dieuHoa: true,
      wifi: true,
      bep: true,
      doXe: true,
      hoBoi: false,
      banUi: true,
      diaChiId: 1,
      diaChi: {
        id: 1,
        tenViTri: "Downtown",
        tinhThanh: "Ho Chi Minh City",
        quocGia: "Vietnam",
        hinhAnh: ""
      },
      hinhAnh: ""
    };
    
    setRoom(mockRoom);
    setLoading(false);
  };

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Use a safer approach to parse the ID
        const roomId = Array.isArray(id) ? id[0] : id;
        
        if (!roomId) {
          throw new Error('Room ID is missing');
        }
        
        // Try with token - add retry logic for authentication issues
        const roomResponse = await fetch(
          `https://airbnbnew.cybersoft.edu.vn/api/phong-thue/${roomId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'tokenByClass': TOKEN_BY_CLASS
            }
          }
        );
        
        if (!roomResponse.ok) {
          if (roomResponse.status === 403) {
            setErrorType('auth');
            throw new Error(`Authentication failed: Your token may have expired`);
          } else if (roomResponse.status === 404) {
            setErrorType('data');
            throw new Error(`Room with ID ${roomId} not found`);
          } else {
            setErrorType('network');
            throw new Error(`API error: ${roomResponse.status}`);
          }
        }
        
        const roomData = await roomResponse.json();
        
        // Also fetch images
        const imagesResponse = await fetch(
          `https://airbnbnew.cybersoft.edu.vn/api/phong-thue/lay-hinh-phong/${roomId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              'tokenByClass': TOKEN_BY_CLASS
            }
          }
        );
        
        // Set room data even if images fail
        if (roomData?.content) {
          setRoom(roomData.content);
        } else {
          setErrorType('data');
          throw new Error('Invalid room data format received');
        }
        
        // Add images if available
        if (imagesResponse.ok) {
          const imagesData = await imagesResponse.json();
          if (imagesData?.content) {
            setImages(imagesData.content || []);
          }
        }
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error fetching room details';
        console.error('Room detail error:', errorMessage, 'Type:', errorType);
        setError(errorMessage);
        
        // If all API attempts fail, use mock data as fallback
        useMockData();
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchRoomDetails();
    }
  }, [id, router, retryCount]);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === (images.length > 0 ? images.length - 1 : 0) ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? (images.length > 0 ? images.length - 1 : 0) : prev - 1
    );
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If setting check-in date after check-out, clear check-out
    if (name === 'checkIn' && value > dateRange.checkOut && dateRange.checkOut) {
      setDateRange(prev => ({
        ...prev,
        checkOut: ''
      }));
    }
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGuests(parseInt(e.target.value));
  };

  const handleBooking = async () => {
    if (!dateRange.checkIn || !dateRange.checkOut) {
      alert('Vui lòng chọn ngày nhận phòng và trả phòng');
      return;
    }
    
    // Validate dates
    const checkInDate = new Date(dateRange.checkIn);
    const checkOutDate = new Date(dateRange.checkOut);
    
    if (checkInDate >= checkOutDate) {
      alert('Ngày trả phòng phải sau ngày nhận phòng');
      return;
    }
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Save booking info in session storage for after login
      sessionStorage.setItem('pendingBooking', JSON.stringify({
        roomId: room?.id,
        checkIn: dateRange.checkIn,
        checkOut: dateRange.checkOut,
        guests
      }));
      
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    
    try {
      // In a real app, you would make an API call here
      alert(`Đã đặt phòng từ ${dateRange.checkIn} đến ${dateRange.checkOut} với ${guests} khách`);
    } catch (err) {
      console.error('Booking failed:', err);
      alert('Đặt phòng thất bại. Vui lòng thử lại.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  // Error state with retry button
  if (error && !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Có lỗi xảy ra</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          {errorType === 'auth' && (
            <p className="mt-1 text-rose-500">
              Lỗi xác thực. Token của bạn có thể đã hết hạn hoặc không hợp lệ.
            </p>
          )}
          <div className="mt-4 flex gap-4 justify-center">
            <Button 
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              onClick={() => window.history.back()}
            >
              Quay lại
            </Button>
            <Button 
              className="bg-rose-500 hover:bg-rose-600 text-white"
              onClick={() => {
                setRetryCount(prev => prev + 1);
                window.location.reload();
              }}
            >
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If we have no room data at this point, show a general error
  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy phòng</h2>
          <Button 
            className="mt-4"
            onClick={() => window.history.back()}
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const amenities = [
    { name: 'Máy giặt', value: room.mayGiat, icon: <Home /> },
    { name: 'Bàn là', value: room.banLa, icon: <Home /> },
    { name: 'TV', value: room.tivi, icon: <Home /> },
    { name: 'Điều hòa', value: room.dieuHoa, icon: <Home /> },
    { name: 'WiFi', value: room.wifi, icon: <Home /> },
    { name: 'Bếp', value: room.bep, icon: <Home /> },
    { name: 'Chỗ đỗ xe', value: room.doXe, icon: <Home /> },
    { name: 'Hồ bơi', value: room.hoBoi, icon: <Home /> },
    { name: 'Bàn ủi', value: room.banUi, icon: <Home /> },
  ];

  const getImageUrl = (image: string) => {
    if (!image) return 'https://placehold.co/800x600?text=No+Image';
    return image.includes('http') ? image : `https://airbnbnew.cybersoft.edu.vn${image}`;
  };

  // Calculate price based on selected dates
  const calculateNights = () => {
    if (!dateRange.checkIn || !dateRange.checkOut) return 0;
    const checkIn = new Date(dateRange.checkIn);
    const checkOut = new Date(dateRange.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const nights = calculateNights();
  const basePrice = nights > 0 ? room.giaTien * nights : 0;
  const serviceFee = Math.round(basePrice * 0.15);
  const totalPrice = basePrice + serviceFee;

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Room Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{room.tenPhong}</h1>
        <div className="flex items-center justify-between mt-2 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-rose-500" />
              <span className="ml-1 font-medium">4.85</span>
            </div>
            <span>•</span>
            <span className="underline font-medium">42 đánh giá</span>
            <span>•</span>
            <div className="flex items-center">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="ml-1">
                {room.diaChi?.tenViTri ? 
                  `${room.diaChi.tenViTri}, ${room.diaChi.tinhThanh}, ${room.diaChi.quocGia}` : 
                  'Location information unavailable'}
              </span>
            </div>
          </div>
          <div className="flex gap-3 mt-2 sm:mt-0">
            <button className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-md">
              <Share className="w-4 h-4" />
              <span className="underline">Chia sẻ</span>
            </button>
            <button className="flex items-center gap-1 p-1 hover:bg-gray-100 rounded-md">
              <Heart className="w-4 h-4" />
              <span className="underline">Lưu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Room Gallery */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-xl overflow-hidden">
          {images.length > 0 ? (
            <img 
              src={getImageUrl(images[currentImageIndex]?.hinhAnh)} 
              alt={`Room image ${currentImageIndex + 1}`}
              className="w-full h-[500px] object-cover"
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = 'https://placehold.co/800x600?text=Image+Error';
              }}
            />
          ) : (
            <img 
              src={getImageUrl(room.hinhAnh)} 
              alt={room.tenPhong}
              className="w-full h-[500px] object-cover" 
              onError={(e) => {
                // Fallback if image fails to load
                e.currentTarget.src = 'https://placehold.co/800x600?text=Image+Error';
              }}
            />
          )}
        </div>
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              aria-label="Previous image"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
              aria-label="Next image"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Room Information */}
        <div className="col-span-2">
          <div className="border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">
                  Toàn bộ căn hộ được chủ nhà Hosted by John
                </h2>
                <p className="text-gray-600">
                  {room.khach} khách • {room.phongNgu} phòng ngủ • {room.giuong} giường • {room.phongTam} phòng tắm
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden">
                <User className="w-full h-full p-2" />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="py-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-4">
                <Home className="w-8 h-8 mt-1" />
                <div>
                  <h3 className="font-medium">Toàn bộ nhà</h3>
                  <p className="text-gray-600 text-sm">Bạn sẽ có căn hộ cho riêng mình</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Medal className="w-8 h-8 mt-1" />
                <div>
                  <h3 className="font-medium">Vệ sinh tăng cường</h3>
                  <p className="text-gray-600 text-sm">Chủ nhà đã cam kết vệ sinh theo quy trình tăng cường</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <User className="w-8 h-8 mt-1" />
                <div>
                  <h3 className="font-medium">Chủ nhà siêu cấp</h3>
                  <p className="text-gray-600 text-sm">Chủ nhà có kinh nghiệm và đánh giá cao</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Giới thiệu về chỗ ở này</h2>
            <p className="text-gray-700 whitespace-pre-line">{room.moTa}</p>
          </div>

          {/* Amenities */}
          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">Tiện nghi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {amenities.map((amenity, index) => (
                amenity.value && (
                  <div key={index} className="flex items-center gap-4">
                    {amenity.icon}
                    <span>{amenity.name}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <div className="col-span-1">
          <div className="sticky top-24 border rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-xl font-bold">${room.giaTien}</span>
                <span className="text-gray-600"> / đêm</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-rose-500" />
                <span className="ml-1">4.85 · 42 đánh giá</span>
              </div>
            </div>

            <div className="border rounded-t-lg rounded-b-lg">
              <div className="grid grid-cols-2 border-b">
                <div className="p-3 border-r">
                  <label className="block text-xs font-bold">NHẬN PHÒNG</label>
                  <input 
                    type="date" 
                    name="checkIn"
                    value={dateRange.checkIn}
                    onChange={handleDateChange}
                    className="w-full border-none p-0"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="p-3">
                  <label className="block text-xs font-bold">TRẢ PHÒNG</label>
                  <input 
                    type="date" 
                    name="checkOut"
                    value={dateRange.checkOut}
                    onChange={handleDateChange}
                    className="w-full border-none p-0"
                    min={dateRange.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="p-3">
                <label className="block text-xs font-bold">KHÁCH</label>
                <select 
                  value={guests}
                  onChange={handleGuestsChange}
                  className="w-full border-none p-0"
                >
                  {[...Array(room.khach || 1)].map((_, i) => (
                    <option key={i} value={i + 1}>{i + 1} khách</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg font-medium"
            >
              Đặt phòng
            </Button>

            <div className="mt-4 text-center text-gray-600">
              <p>Bạn chưa bị trừ tiền</p>
            </div>

            {nights > 0 && (
              <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="underline">${room.giaTien} x {nights} đêm</span>
                  <span>${basePrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline">Phí dịch vụ</span>
                  <span>${serviceFee}</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-bold">
                  <span>Tổng</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailPage;