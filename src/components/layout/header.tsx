"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaSearch, FaBars } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  
  // Giả sử chúng ta có một hook useAuth để kiểm tra đăng nhập
  const { isAuthenticated, user, logout } = { isAuthenticated: false, user: null, logout: () => {} };

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-8 w-32">
            <div className="text-rose-500 font-bold text-2xl">Airbnb Clone</div>
          </div>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex items-center border rounded-full py-2 px-4 shadow-sm hover:shadow-md transition cursor-pointer">
          <div className="text-sm font-semibold px-2">Địa điểm bất kỳ</div>
          <div className="border-l border-gray-300 h-6"></div>
          <div className="text-sm font-semibold px-2">Tuần bất kỳ</div>
          <div className="border-l border-gray-300 h-6"></div>
          <div className="text-sm text-gray-600 px-2">Thêm khách</div>
          <div className="bg-rose-500 p-2 rounded-full text-white">
            <FaSearch size={12} />
          </div>
        </div>

        {/* User Menu */}
        <div className="relative">
          <div 
            className="flex items-center border rounded-full py-2 px-4 cursor-pointer hover:shadow-md transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars className="mr-2" />
            <FaUserCircle size={24} className="text-gray-500" />
          </div>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-10">
              {isAuthenticated ? (
                <>
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Hồ sơ
                  </Link>
                  <Link 
                    href="/bookings" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đặt phòng của tôi
                  </Link>
                  <button 
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    href="/auth/signin" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
