'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import { searchService } from '@/services/search.service';
import { locationService } from '@/services/location.service';
import Link from 'next/link';
import Image from 'next/image';
import { Room, Location } from '@/types';
import { ApiResponse } from '@/config/axios.config';
import { MapPin } from 'lucide-react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword') || '';
  const locationId = searchParams.get('locationId');

  const { data: searchData, isLoading } = useQuery<ApiResponse<Room[]>>({
    queryKey: ['search', keyword, locationId],
    queryFn: () => {
      if (!keyword.trim()) {
        return locationId
          ? searchService.searchRoomsByLocation(Number(locationId), '')
          : searchService.searchRooms('');
      }
      return locationId
        ? searchService.searchRoomsByLocation(Number(locationId), keyword)
        : searchService.searchRooms(keyword);
    },
  });

  const { data: locationData } = useQuery<ApiResponse<Location>>({
    queryKey: ['location', locationId],
    queryFn: () => locationService.getLocationById(Number(locationId)),
    enabled: !!locationId,
  });

  const rooms = searchData?.content || [];
  const location = locationData?.content;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {location
            ? `Search results in ${location.tenViTri}`
            : 'Search results'}
        </h1>
        {keyword && (
          <p className="text-gray-600">
            Showing results for &quot;{keyword}&quot;
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No rooms found</h2>
          <p className="text-gray-600 mb-8">
            Try adjusting your search criteria or exploring other locations
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Explore all locations
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <Link
              key={room.id}
              href={`/rooms/${room.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3">
                <Image
                  src={room.hinhAnh || '/placeholder.jpg'}
                  alt={room.tenPhong}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{room.tenPhong}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{room.moTa}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {room.phongNgu} bedroom{room.phongNgu > 1 ? 's' : ''} •{' '}
                      {room.phongTam} bath{room.phongTam > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="font-semibold">${room.giaTien} / night</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
