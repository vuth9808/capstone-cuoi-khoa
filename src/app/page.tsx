'use client';

import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { roomService } from '@/services/room.service';
import { Location, Room } from '@/types';
import { ApiResponse } from '@/config/axios.config';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '../components/search/search-bar';
import { getValidImageUrl } from '@/utils/image';
import { MapPin, Star, ArrowRight, Users, Bed, Bath, Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/favorites.context';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { user } = useAuthStore();

  const { data: locationsData } = useQuery<ApiResponse<Location[]>>({
    queryKey: ['locations'],
    queryFn: () => locationService.getLocations(),
  });

  const { data: roomsData } = useQuery<ApiResponse<Room[]>>({
    queryKey: ['featured-rooms'],
    queryFn: () => roomService.getRooms(),
  });

  const locations = locationsData?.content || [];
  const rooms = roomsData?.content || [];

  // Get 8 random rooms for featured section
  const featuredRooms = rooms
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
    
  // Handle favorite toggle for a room
  const handleRoomFavoriteToggle = (e: React.MouseEvent, room: Room) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng yêu thích');
      return;
    }
    
    if (isFavorite(room.id, 'room')) {
      removeFavorite(room.id, 'room');
      toast.success(`Đã xóa "${room.tenPhong}" khỏi danh sách yêu thích`);
    } else {
      addFavorite(room.id, 'room');
      toast.success(`Đã thêm "${room.tenPhong}" vào danh sách yêu thích`);
    }
  };
  
  // Handle favorite toggle for a location
  const handleLocationFavoriteToggle = (e: React.MouseEvent, location: Location) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng yêu thích');
      return;
    }
    
    if (isFavorite(location.id, 'location')) {
      removeFavorite(location.id, 'location');
      toast.success(`Đã xóa "${location.tenViTri}" khỏi danh sách yêu thích`);
    } else {
      addFavorite(location.id, 'location');
      toast.success(`Đã thêm "${location.tenViTri}" vào danh sách yêu thích`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-16 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://a0.muscache.com/im/pictures/e4a2a61c-589f-4e49-b3b8-968a6bc23389.jpg"
            alt="Hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-4">Khám phá không gian nghỉ dưỡng lý tưởng</h1>
            <p className="text-xl mb-8">Với hàng nghìn địa điểm đặc biệt trên khắp thế giới dành cho bạn.</p>
            
             <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-airbnb-hof dark:text-white">Địa điểm nổi bật</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Khám phá các địa điểm tuyệt vời cho chuyến đi sắp tới của bạn</p>
          </div>
          <Link href="/locations" className="text-airbnb-rosa hover:text-airbnb-rausch font-medium flex items-center transition-colors">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.slice(0, 8).map((location: Location, index) => (
            <div key={location.id} className="group relative">
              <Link
                href={`/rooms?locationId=${location.id}`}
                className="block"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={getValidImageUrl(location.hinhAnh, 'location') || 'https://picsum.photos/400/400'}
                    alt={location.tenViTri}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized={!location.hinhAnh}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="font-bold text-xl">{location.tenViTri}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      <p className="text-sm">{location.tinhThanh}, {location.quocGia}</p>
                    </div>
                  </div>
                </div>
              </Link>
              {mounted && (
                <button 
                  onClick={(e) => handleLocationFavoriteToggle(e, location)}
                  className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                  aria-label={isFavorite(location.id, 'location') ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  <Heart className={`h-5 w-5 ${
                    isFavorite(location.id, 'location') 
                      ? 'text-airbnb-rosa fill-airbnb-rosa' 
                      : 'text-airbnb-rosa'
                  }`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section className="bg-airbnb-foggy dark:bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-airbnb-hof dark:text-white">Phòng đề xuất</h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Những lựa chọn tuyệt vời cho kỳ nghỉ hoàn hảo của bạn</p>
            </div>
            <Link href="/rooms" className="text-airbnb-rosa hover:text-airbnb-rausch font-medium flex items-center transition-colors">
              Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredRooms.map((room, index) => (
              <div key={room.id} className="group relative">
                <Link
                  href={`/rooms/${room.id}`}
                  className="block bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getValidImageUrl(room.hinhAnh, 'room') || 'https://picsum.photos/400/300'}
                      alt={room.tenPhong}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      unoptimized={!room.hinhAnh}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-medium text-airbnb-rosa">
                      ${room.giaTien} <span className="text-xs text-gray-500 dark:text-gray-400">/đêm</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-airbnb-hof dark:text-white group-hover:text-airbnb-rosa transition-colors line-clamp-1">{room.tenPhong}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 text-sm">{room.moTa}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.wifi && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-airbnb-babu dark:text-blue-300 rounded-md text-xs">
                          Wifi
                        </span>
                      )}
                      {room.dieuHoa && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-airbnb-babu dark:text-blue-300 rounded-md text-xs">
                          Điều hòa
                        </span>
                      )}
                      {room.bep && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-airbnb-babu dark:text-blue-300 rounded-md text-xs">
                          Bếp
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Bed className="h-4 w-4 mr-1" />
                          <span className="text-sm">{room.phongNgu}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Bath className="h-4 w-4 mr-1" />
                          <span className="text-sm">{room.phongTam}</span>
                        </div>
                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{room.khach}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span className="font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </Link>
                {mounted && (
                  <button 
                    onClick={(e) => handleRoomFavoriteToggle(e, room)}
                    className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                    aria-label={isFavorite(room.id, 'room') ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  >
                    <Heart className={`h-5 w-5 ${
                      isFavorite(room.id, 'room') 
                        ? 'text-airbnb-rosa fill-airbnb-rosa' 
                        : 'text-airbnb-rosa'
                    }`} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-airbnb-rosa to-airbnb-rausch rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-white">Trở thành chủ nhà</h2>
              <p className="text-white opacity-90 mb-6">Chia sẻ không gian của bạn, tạo thêm thu nhập và mở ra những cơ hội mới bằng cách chia sẻ nơi ở của bạn.</p>
              <div>
                <Link 
                  href="/become-host" 
                  className="inline-flex items-center px-6 py-3 bg-white hover:bg-airbnb-foggy text-airbnb-rosa font-medium rounded-full transition-colors dark:hover:bg-gray-200"
                >
                  Tìm hiểu thêm <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image
                src="https://a0.muscache.com/im/pictures/791aba62-2de8-4722-99b5-45838715eb34.jpg"
                alt="Become a host"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
