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
import { animateElement, AnimationTypes } from '@/utils/animation';

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
    
    const button = e.currentTarget as HTMLButtonElement;
    
    if (isFavorite(room.id, 'room')) {
      animateElement(button, AnimationTypes.BOUNCE).then(() => {
        removeFavorite(room.id, 'room');
        toast.success(`Đã xóa "${room.tenPhong}" khỏi danh sách yêu thích`);
      });
    } else {
      animateElement(button, AnimationTypes.HEART_BEAT);
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
    
    const button = e.currentTarget as HTMLButtonElement;
    
    if (isFavorite(location.id, 'location')) {
      animateElement(button, AnimationTypes.BOUNCE).then(() => {
        removeFavorite(location.id, 'location');
        toast.success(`Đã xóa "${location.tenViTri}" khỏi danh sách yêu thích`);
      });
    } else {
      animateElement(button, AnimationTypes.HEART_BEAT);
      addFavorite(location.id, 'location');
      toast.success(`Đã thêm "${location.tenViTri}" vào danh sách yêu thích`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="space-y-16 bg-theme-primary">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://www.spinxdigital.com/app/uploads/2022/11/image-airbnb.jpg"
            alt="Hero background"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-white animate__animated animate__fadeIn animate__delay-1s">
            <h1 className="text-5xl font-bold mb-4 animate__animated animate__fadeInDown">Khám phá không gian nghỉ dưỡng lý tưởng</h1>
            <p className="text-xl mb-8 animate__animated animate__fadeInUp animate__delay-1s">Với hàng nghìn địa điểm đặc biệt trên khắp thế giới dành cho bạn.</p>
            
            <div className="animate__animated animate__fadeInUp animate__delay-2s">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="animate__animated animate__fadeInLeft">
            <h2 className="text-3xl font-bold text-theme-primary">Địa điểm nổi bật</h2>
            <p className="text-theme-secondary mt-2">Khám phá các địa điểm tuyệt vời cho chuyến đi sắp tới của bạn</p>
          </div>
          <Link href="/locations" className="text-airbnb-rosa hover:text-airbnb-rausch font-medium flex items-center transition-colors animate__animated animate__fadeInRight">
            Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {locations.slice(0, 8).map((location: Location, index) => (
            <div key={location.id} className={`group relative animate__animated animate__fadeIn animate__delay-${index % 5}s`}>
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
                  className="absolute top-3 right-3 z-10 bg-theme-primary p-2 rounded-full shadow-md hover:scale-110 transition-all duration-200 hover:shadow-lg active:scale-95"
                  aria-label={isFavorite(location.id, 'location') ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  <Heart className={`h-5 w-5 transition-all duration-200 ${
                    isFavorite(location.id, 'location') 
                      ? 'text-red-500 fill-red-500 scale-110' 
                      : 'text-theme-secondary hover:text-red-500'
                  }`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Places */}
      <section className="bg-theme-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="animate__animated animate__fadeInLeft">
              <h2 className="text-3xl font-bold text-theme-primary">Phòng đề xuất</h2>
              <p className="text-theme-secondary mt-2">Những lựa chọn tuyệt vời cho kỳ nghỉ hoàn hảo của bạn</p>
            </div>
            <Link href="/rooms" className="text-airbnb-rosa hover:text-airbnb-rausch font-medium flex items-center transition-colors animate__animated animate__fadeInRight">
              Xem tất cả <ArrowRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredRooms.map((room, index) => (
              <div key={room.id} className={`group relative animate__animated animate__fadeIn animate__delay-${index % 5}s`}>
                <Link
                  href={`/rooms/${room.id}`}
                  className="block bg-theme-primary rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
                      ${room.giaTien} <span className="text-xs text-theme-secondary">/đêm</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 text-theme-primary group-hover:text-airbnb-rosa transition-colors line-clamp-1">{room.tenPhong}</h3>
                    <p className="text-theme-secondary mb-3 line-clamp-2 text-sm">{room.moTa}</p>
                    
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
                        <div className="flex items-center text-theme-secondary">
                          <Bed className="h-4 w-4 mr-1" />
                          <span className="text-sm">{room.phongNgu}</span>
                        </div>
                        <div className="flex items-center text-theme-secondary">
                          <Bath className="h-4 w-4 mr-1" />
                          <span className="text-sm">{room.phongTam}</span>
                        </div>
                        <div className="flex items-center text-theme-secondary">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-sm">{room.khach}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-amber-500">
                        <Star className="h-4 w-4 fill-current mr-1" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                  </div>
                </Link>
                
                {mounted && (
                  <button 
                    onClick={(e) => handleRoomFavoriteToggle(e, room)}
                    className="absolute top-3 right-3 z-10 bg-theme-primary p-2 rounded-full shadow-md hover:scale-110 transition-all duration-200 hover:shadow-lg active:scale-95"
                    aria-label={isFavorite(room.id, 'room') ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                  >
                    <Heart className={`h-5 w-5 transition-all duration-200 ${
                      isFavorite(room.id, 'room') 
                        ? 'text-red-500 fill-red-500 scale-110' 
                        : 'text-theme-secondary hover:text-red-500'
                    }`} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-theme-primary mb-3">Tại sao chọn chúng tôi?</h2>
          <p className="text-theme-secondary max-w-3xl mx-auto">Chúng tôi cam kết mang đến trải nghiệm đặt phòng tốt nhất với nhiều lựa chọn phù hợp với nhu cầu của bạn</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="theme-card text-center p-6 animate__animated animate__fadeInUp">
            <div className="w-16 h-16 bg-airbnb-rosa/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-airbnb-rosa" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-theme-primary">Đảm bảo chất lượng</h3>
            <p className="text-theme-secondary">Tất cả các phòng đều được đánh giá và kiểm tra kỹ lưỡng để đảm bảo chất lượng tốt nhất cho khách hàng.</p>
          </div>
          
          <div className="theme-card text-center p-6 animate__animated animate__fadeInUp animate__delay-1s">
            <div className="w-16 h-16 bg-airbnb-babu/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-airbnb-babu" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-theme-primary">Tiết kiệm thời gian</h3>
            <p className="text-theme-secondary">Quy trình đặt phòng đơn giản, nhanh chóng giúp bạn tiết kiệm thời gian và tìm được phòng ưng ý.</p>
          </div>
          
          <div className="theme-card text-center p-6 animate__animated animate__fadeInUp animate__delay-2s">
            <div className="w-16 h-16 bg-airbnb-hof/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-airbnb-hof" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-theme-primary">Hỗ trợ 24/7</h3>
            <p className="text-theme-secondary">Đội ngũ hỗ trợ khách hàng luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi khi cần thiết.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
