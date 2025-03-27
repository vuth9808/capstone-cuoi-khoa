'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/contexts/favorites.context';
import { useQuery } from '@tanstack/react-query';
import { locationService } from '@/services/location.service';
import { roomService } from '@/services/room.service';
import { Room, Location } from '@/types';
import { ApiResponse } from '@/config/axios.config';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Building, Users, Bath, Bed, Home } from 'lucide-react';
import { getValidImageUrl } from '@/utils/image';
import { toast } from 'react-hot-toast';

export default function FavoritesPage() {
  const [activeTab, setActiveTab] = useState<'rooms' | 'locations'>('rooms');
  const [mounted, setMounted] = useState(false);
  
  const { favorites, removeFavorite } = useFavorites();
  
  // Get all favorite IDs by type
  const roomFavorites = favorites.filter(fav => fav.type === 'room').map(fav => fav.id);
  const locationFavorites = favorites.filter(fav => fav.type === 'location').map(fav => fav.id);
  
  // Fetch all locations
  const { data: locationsData } = useQuery<ApiResponse<Location[]>>({
    queryKey: ['locations'],
    queryFn: () => locationService.getLocations(),
    enabled: mounted && locationFavorites.length > 0,
  });
  
  // Fetch all rooms
  const { data: roomsData } = useQuery<ApiResponse<Room[]>>({
    queryKey: ['rooms'],
    queryFn: () => roomService.getRooms(),
    enabled: mounted && roomFavorites.length > 0,
  });
  
  // Filter to get only favorited items
  const favoriteLocations = locationsData?.content?.filter(location => 
    locationFavorites.includes(location.id)
  ) || [];
  
  const favoriteRooms = roomsData?.content?.filter(room => 
    roomFavorites.includes(room.id)
  ) || [];
  
  // Remove from favorites
  const handleRemoveRoom = (room: Room) => {
    removeFavorite(room.id, 'room');
    toast.success(`Đã xóa "${room.tenPhong}" khỏi danh sách yêu thích`);
  };
  
  const handleRemoveLocation = (location: Location) => {
    removeFavorite(location.id, 'location');
    toast.success(`Đã xóa "${location.tenViTri}" khỏi danh sách yêu thích`);
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airbnb-rosa"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-airbnb-foggy min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-airbnb-hof flex items-center">
                  <Heart className="h-6 w-6 mr-2 text-airbnb-rosa fill-airbnb-rosa" />
                  Danh sách yêu thích của tôi
                </h1>
                <div className="text-sm text-gray-500">
                  {favoriteRooms.length} phòng, {favoriteLocations.length} địa điểm
                </div>
              </div>
              
              {/* Tabs */}
              <div className="mt-6 flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('rooms')}
                  className={`flex items-center pb-3 px-1 ${
                    activeTab === 'rooms'
                      ? 'border-b-2 border-airbnb-rosa text-airbnb-rosa font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Home className="h-5 w-5 mr-2" />
                  Phòng ({favoriteRooms.length})
                </button>
                <button
                  onClick={() => setActiveTab('locations')}
                  className={`flex items-center ml-8 pb-3 px-1 ${
                    activeTab === 'locations'
                      ? 'border-b-2 border-airbnb-rosa text-airbnb-rosa font-medium'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Building className="h-5 w-5 mr-2" />
                  Địa điểm ({favoriteLocations.length})
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {activeTab === 'rooms' && (
                <>
                  {favoriteRooms.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favoriteRooms.map(room => (
                        <div key={room.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-40 h-40">
                              <Image
                                src={getValidImageUrl(room.hinhAnh, 'room') || 'https://picsum.photos/200/200'}
                                alt={room.tenPhong}
                                fill
                                priority={favoriteRooms.indexOf(room) === 0}
                                sizes="(max-width: 640px) 100vw, 160px"
                                className="object-cover"
                                unoptimized={!room.hinhAnh}
                              />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-airbnb-hof mb-1 hover:text-airbnb-rosa transition-colors">
                                    <Link href={`/rooms/${room.id}`}>{room.tenPhong}</Link>
                                  </h3>
                                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{room.moTa}</p>
                                </div>
                                <button 
                                  onClick={() => handleRemoveRoom(room)}
                                  className="text-airbnb-rosa hover:text-airbnb-rausch p-1"
                                >
                                  <Heart className="h-5 w-5 fill-current" />
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-3 text-sm text-gray-500 mt-auto">
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
                                <div className="ml-auto font-bold text-airbnb-rosa">
                                  ${room.giaTien} <span className="font-normal text-xs text-gray-500">/đêm</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="bg-airbnb-foggy rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-airbnb-hof mb-2">Không có phòng yêu thích</h3>
                      <p className="text-gray-500 mb-4">Bạn chưa thêm phòng nào vào danh sách yêu thích</p>
                      <Link 
                        href="/rooms" 
                        className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-airbnb-rosa hover:bg-airbnb-rausch"
                      >
                        Tìm phòng
                      </Link>
                    </div>
                  )}
                </>
              )}
              
              {activeTab === 'locations' && (
                <>
                  {favoriteLocations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {favoriteLocations.map(location => (
                        <div key={location.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row">
                            <div className="relative w-full sm:w-40 h-40">
                              <Image
                                src={getValidImageUrl(location.hinhAnh, 'location') || 'https://picsum.photos/200/200'}
                                alt={location.tenViTri}
                                fill
                                priority={favoriteLocations.indexOf(location) === 0}
                                sizes="(max-width: 640px) 100vw, 160px"
                                className="object-cover"
                                unoptimized={!location.hinhAnh}
                              />
                            </div>
                            <div className="p-4 flex-1 flex flex-col">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-bold text-airbnb-hof mb-1 hover:text-airbnb-rosa transition-colors">
                                    <Link href={`/rooms?locationId=${location.id}`}>{location.tenViTri}</Link>
                                  </h3>
                                  <div className="flex items-center text-gray-600 text-sm">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{location.tinhThanh}, {location.quocGia}</span>
                                  </div>
                                </div>
                                <button 
                                  onClick={() => handleRemoveLocation(location)}
                                  className="text-airbnb-rosa hover:text-airbnb-rausch p-1"
                                >
                                  <Heart className="h-5 w-5 fill-current" />
                                </button>
                              </div>
                              
                              <div className="mt-auto">
                                <Link 
                                  href={`/rooms?locationId=${location.id}`}
                                  className="text-sm text-airbnb-rosa font-medium hover:text-airbnb-rausch inline-flex items-center"
                                >
                                  Xem phòng tại địa điểm này
                                  <span className="ml-1">→</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <div className="bg-airbnb-foggy rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                        <Building className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-medium text-airbnb-hof mb-2">Không có địa điểm yêu thích</h3>
                      <p className="text-gray-500 mb-4">Bạn chưa thêm địa điểm nào vào danh sách yêu thích</p>
                      <Link 
                        href="/locations" 
                        className="inline-flex items-center px-4 py-2 border border-transparent font-medium rounded-md shadow-sm text-white bg-airbnb-rosa hover:bg-airbnb-rausch"
                      >
                        Khám phá địa điểm
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 