'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { roomService } from '@/services/room.service';
import { locationService } from '@/services/location.service';
import { Room, Location } from '@/types';
import { ApiResponse } from '@/config/axios.config';
import { getValidImageUrl } from '@/utils/image';
import { useFavorites } from '@/contexts/favorites.context';
import { toast } from 'react-hot-toast';
import { 
  Search, 
  MapPin, 
  Bed, 
  Bath, 
  Users, 
  Wifi, 
  Tv, 
  Wind, 
  Car,
  Utensils,
  Filter,
  ArrowLeft,
  Star,
  Heart
} from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { animateElement, AnimationTypes } from '@/utils/animation';

export default function RoomsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locationId = searchParams.get('locationId');
  const [mounted, setMounted] = useState(false);
  
  // Favorites
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [guestCount, setGuestCount] = useState(1);
  const [amenities, setAmenities] = useState({
    wifi: false,
    airCon: false,
    kitchen: false,
    parking: false,
    tv: false,
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);

  // Fetch location data if locationId is provided
  const { data: locationData, isLoading: isLocationLoading } = useQuery<ApiResponse<Location>>({
    queryKey: ['location', locationId],
    queryFn: () => locationService.getLocationById(Number(locationId)),
    enabled: !!locationId,
  });

  // Fetch rooms data
  const { data: roomsData, isLoading: isRoomsLoading } = useQuery<ApiResponse<Room[]>>({
    queryKey: ['rooms', locationId],
    queryFn: () =>
      locationId
        ? roomService.getRoomsByLocationId(Number(locationId))
        : roomService.getRooms(),
  });

  const location = locationData?.content;
  const rooms = useMemo(() => roomsData?.content || [], [roomsData]);

  // Auth store
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Apply filters whenever rooms or filter values change
  useEffect(() => {
    if (rooms.length > 0) {
      let filtered = [...rooms];
      
      // Filter by search term
      if (searchTerm.trim() !== '') {
        filtered = filtered.filter(room => 
          room.tenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
          room.moTa.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      // Filter by price range
      filtered = filtered.filter(room => 
        room.giaTien >= priceRange[0] && room.giaTien <= priceRange[1]
      );
      
      // Filter by guest count
      filtered = filtered.filter(room => room.khach >= guestCount);
      
      // Filter by amenities
      if (amenities.wifi) {
        filtered = filtered.filter(room => room.wifi);
      }
      if (amenities.airCon) {
        filtered = filtered.filter(room => room.dieuHoa);
      }
      if (amenities.kitchen) {
        filtered = filtered.filter(room => room.bep);
      }
      if (amenities.parking) {
        filtered = filtered.filter(room => room.doXe);
      }
      if (amenities.tv) {
        filtered = filtered.filter(room => room.tivi);
      }
      
      setFilteredRooms(filtered);
    }
  }, [rooms, searchTerm, priceRange, guestCount, amenities]);

  // Set price range based on min and max prices in rooms
  useEffect(() => {
    if (rooms.length > 0) {
      const prices = rooms.map(room => room.giaTien);
      const minPrice = Math.floor(Math.min(...prices));
      const maxPrice = Math.ceil(Math.max(...prices));
      setPriceRange([minPrice, maxPrice]);
    }
  }, [rooms]);
  
  // Handle favorite toggle
  const handleFavoriteToggle = (e: React.MouseEvent, room: Room) => {
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

  // Loading state
  if (!mounted || isRoomsLoading || (locationId && isLocationLoading)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airbnb-rosa"></div>
      </div>
    );
  }

  return (
    <div className="bg-airbnb-foggy min-h-screen">
      
      {/* Location header */}
      {location ? (
        
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-airbnb-rosa to-airbnb-kazan overflow-hidden animate__animated animate__fadeIn">
          
          <div className="absolute inset-0 opacity-30">
            <Image 
              src={getValidImageUrl(location.hinhAnh, 'location') || 'https://picsum.photos/1200/400'} 
              alt={location.tenViTri}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate__animated animate__fadeInDown animate__delay-1s">
              Phòng tại {location.tenViTri}
            </h1>
            <div className="flex items-center text-white animate__animated animate__fadeInUp animate__delay-1s">
              <MapPin className="h-5 w-5 mr-2" />
              <p className="text-lg">
                {location.tinhThanh}, {location.quocGia}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative h-64 md:h-80 bg-gradient-to-r from-airbnb-rosa to-airbnb-kazan overflow-hidden animate__animated animate__fadeIn">
          <div className="absolute inset-0 opacity-30">
            <Image 
              src="https://picsum.photos/1200/400" 
              alt="Browse all rooms"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 animate__animated animate__fadeInDown animate__delay-1s">
              Khám phá các phòng của chúng tôi
            </h1>
            <p className="text-lg text-white animate__animated animate__fadeInUp animate__delay-1s">
              Tìm phòng hoàn hảo cho chuyến đi của bạn
            </p>
          </div>
        </div>
      )}

      {/* Search and filter bar */}
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg -mt-10 relative z-10 p-4 md:p-6 mb-8 animate__animated animate__fadeInUp animate__delay-2s">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm phòng..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-airbnb-rosa focus:border-airbnb-rosa sm:text-sm"
              />
            </div>
            
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-airbnb-foggy focus:outline-none focus:ring-2 focus:ring-airbnb-rosa"
            >
              <Filter className="h-5 w-5 mr-2 text-gray-500" />
              <span>Bộ lọc</span>
            </button>
          </div>
          
          {/* Expanded filter options */}
          {isFilterOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 animate__animated animate__fadeIn">
              <div>
                <label className="block text-sm font-medium text-airbnb-hof mb-1">Khoảng giá</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb-rosa focus:ring-airbnb-rosa sm:text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={0}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb-rosa focus:ring-airbnb-rosa sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-airbnb-hof mb-1">Số khách</label>
                <input
                  type="number"
                  min={1}
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-airbnb-rosa focus:ring-airbnb-rosa sm:text-sm"
                />
              </div>
              
            <div>
                <label className="block text-sm font-medium text-airbnb-hof mb-1">Tiện nghi</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={amenities.wifi}
                      onChange={() => setAmenities({...amenities, wifi: !amenities.wifi})}
                      className="rounded border-gray-300 text-airbnb-rosa focus:ring-airbnb-rosa"
                    />
                    <span className="ml-2 text-sm text-gray-700">Wifi</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={amenities.airCon}
                      onChange={() => setAmenities({...amenities, airCon: !amenities.airCon})}
                      className="rounded border-gray-300 text-airbnb-rosa focus:ring-airbnb-rosa"
                    />
                    <span className="ml-2 text-sm text-gray-700">Điều hòa</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={amenities.kitchen}
                      onChange={() => setAmenities({...amenities, kitchen: !amenities.kitchen})}
                      className="rounded border-gray-300 text-airbnb-rosa focus:ring-airbnb-rosa"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bếp</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={amenities.parking}
                      onChange={() => setAmenities({...amenities, parking: !amenities.parking})}
                      className="rounded border-gray-300 text-airbnb-rosa focus:ring-airbnb-rosa"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bãi đỗ xe</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={amenities.tv}
                      onChange={() => setAmenities({...amenities, tv: !amenities.tv})}
                      className="rounded border-gray-300 text-airbnb-rosa focus:ring-airbnb-rosa"
                    />
                    <span className="ml-2 text-sm text-gray-700">TV</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Results count */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-between items-center animate__animated animate__fadeIn animate__delay-3s">
        <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
          <h2 className="text-xl font-bold text-airbnb-hof">
            {filteredRooms.length} {filteredRooms.length === 1 ? 'phòng' : 'phòng'} có sẵn
          </h2>
          
          <div className="flex items-center gap-4">
           
            
            {(searchTerm || priceRange[0] > 0 || guestCount > 1 || Object.values(amenities).some(v => v)) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  if (rooms.length > 0) {
                    const prices = rooms.map(room => room.giaTien);
                    const minPrice = Math.floor(Math.min(...prices));
                    const maxPrice = Math.ceil(Math.max(...prices));
                    setPriceRange([minPrice, maxPrice]);
                  }
                  setGuestCount(1);
                  setAmenities({
                    wifi: false,
                    airCon: false,
                    kitchen: false,
                    parking: false,
                    tv: false,
                  });
                }}
                className="text-sm text-airbnb-rosa hover:text-airbnb-rausch font-medium"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Room list */}
      <div className="container mx-auto px-4 pb-12">
        {filteredRooms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRooms.map((room, index) => (
              <div key={room.id} className={`group relative animate__animated animate__fadeIn animate__delay-${index % 5}s`}>
                <Link
                  href={`/rooms/${room.id}`}
                  className="block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getValidImageUrl(room.hinhAnh, 'room') || 'https://picsum.photos/400/300'}
                      alt={room.tenPhong}
                      fill
                      loading={index < 8 ? "eager" : "lazy"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={!room.hinhAnh}
                    />
                    <div className="absolute top-2 right-2 bg-white rounded-lg px-2 py-1 text-xs font-medium shadow-md flex items-center">
                      <Star className="h-3 w-3 text-amber-500 fill-current mr-1" />
                      <span>4.8</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-airbnb-hof mb-1 group-hover:text-airbnb-rosa transition-colors line-clamp-1">
                      {room.tenPhong}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {room.moTa}
                    </p>
                    
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{room.khach}</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        <span>{room.phongNgu}</span>
                      </div>
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        <span>{room.phongTam}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {room.wifi && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-airbnb-kazan rounded-md text-xs">
                          <Wifi className="h-3 w-3 mr-1" /> Wifi
                        </span>
                      )}
                      {room.dieuHoa && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-airbnb-kazan rounded-md text-xs">
                          <Wind className="h-3 w-3 mr-1" /> Điều hòa
                        </span>
                      )}
                      {room.tivi && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-airbnb-kazan rounded-md text-xs">
                          <Tv className="h-3 w-3 mr-1" /> TV
                        </span>
                      )}
                      {room.bep && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-airbnb-kazan rounded-md text-xs">
                          <Utensils className="h-3 w-3 mr-1" /> Bếp
                        </span>
                      )}
                      {room.doXe && (
                        <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-airbnb-kazan rounded-md text-xs">
                          <Car className="h-3 w-3 mr-1" /> Đỗ xe
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <p className="font-bold text-airbnb-rosa">
                        ${room.giaTien} <span className="font-normal text-sm text-gray-500">/đêm</span>
                      </p>
                      <span className="text-sm text-airbnb-rosa font-medium">Xem chi tiết</span>
              </div>
            </div>
          </Link>
                
                {/* Favorite button */}
                <button 
                  onClick={(e) => handleFavoriteToggle(e, room)}
                  className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-all duration-200 hover:shadow-lg active:scale-95"
                  aria-label={isFavorite(room.id, 'room') ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                >
                  <Heart className={`h-5 w-5 transition-all duration-200 ${
                    isFavorite(room.id, 'room') 
                      ? 'text-red-500 fill-red-500 scale-110' 
                      : 'text-gray-500 hover:text-red-500'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-airbnb-foggy mb-4">
              <Search className="h-8 w-8 text-airbnb-rosa" />
            </div>
            <h3 className="text-xl font-medium text-airbnb-hof">Không tìm thấy phòng nào</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Không có phòng nào phù hợp với bộ lọc của bạn. Hãy thử với bộ lọc khác hoặc xóa bộ lọc hiện tại.
            </p>
            <button 
              onClick={() => {
                setSearchTerm('');
                if (rooms.length > 0) {
                  const prices = rooms.map(room => room.giaTien);
                  const minPrice = Math.floor(Math.min(...prices));
                  const maxPrice = Math.ceil(Math.max(...prices));
                  setPriceRange([minPrice, maxPrice]);
                }
                setGuestCount(1);
                setAmenities({
                  wifi: false,
                  airCon: false,
                  kitchen: false,
                  parking: false,
                  tv: false,
                });
              }}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-airbnb-rosa hover:bg-airbnb-rausch"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
