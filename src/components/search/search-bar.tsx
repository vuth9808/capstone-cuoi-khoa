'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { locationService } from '@/services/location.service';
import type { Location } from '@/types';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(
    searchParams.get('locationId') ? Number(searchParams.get('locationId')) : null
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await locationService.getLocations();
        setLocations(response.content);
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchLocations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const params = new URLSearchParams();
    
    // Only add keyword if it's not empty
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword) {
      params.set('keyword', trimmedKeyword);
    }
    
    // Add locationId if selected
    if (selectedLocation) {
      params.set('locationId', selectedLocation.toString());
    }

    // If no parameters, redirect to home
    if (!params.toString()) {
      router.push('/');
    } else {
      router.push(`/search?${params.toString()}`);
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 ">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm theo tên phòng..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <div className="flex-1">
        <div className="relative">
          <select
            value={selectedLocation || ''}
            onChange={(e) => setSelectedLocation(Number(e.target.value) || null)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
          >
            <option value="">Tất cả địa điểm</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.tenViTri}, {location.tinhThanh}
              </option>
            ))}
          </select>
          <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
      </button>
    </form>
  );
}
