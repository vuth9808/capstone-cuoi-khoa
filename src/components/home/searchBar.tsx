"use client"
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch } from 'react-icons/fa';
import { Button } from '../ui/button';

const SearchBar = () => {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Xây dựng tham số tìm kiếm và chuyển hướng
    const searchParams = new URLSearchParams();
    if (location) searchParams.set('location', location);
    if (checkIn) searchParams.set('checkIn', checkIn);
    if (checkOut) searchParams.set('checkOut', checkOut);
    searchParams.set('guests', guests.toString());
    
    router.push(`/rooms?${searchParams.toString()}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 -mt-12 relative z-10 mx-auto max-w-5xl">
      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
          <input
            type="text"
            placeholder="Bạn muốn đi đâu?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nhận phòng</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trả phòng</label>
          <input
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Khách</label>
          <div className="flex">
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
            />
            <Button
              type="submit"
              className="bg-rose-500 text-white px-4 py-2 rounded-r-lg hover:bg-rose-600 transition flex items-center justify-center"
            >
              <FaSearch className="mr-2" />
              Tìm
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;