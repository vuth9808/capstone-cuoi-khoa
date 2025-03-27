'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/auth.store';
import { Menu, User, Home, Heart } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/contexts/toast.context';
import ThemeToggle from '../theme/theme-toggle';

export default function Header() {
  const { user, signOut } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { showSuccess } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut();
    setIsMenuOpen(false);
    showSuccess('Successfully signed out');
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-airbnb-rosa font-bold text-xl">Airbnb Clone</div>
            <div className="w-full max-w-xl mx-4" />
            <div className="w-8 h-8" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-airbnb-rosa font-bold text-xl">
            Airbnb Clone
          </Link>


          <div className="flex items-center gap-4">
            <Link 
              href="/become-host"
              className="hidden md:flex items-center text-airbnb-hof dark:text-white hover:text-airbnb-rosa transition-colors font-medium text-sm px-3 py-2 rounded-full hover:bg-airbnb-foggy dark:hover:bg-gray-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Trở thành chủ nhà
            </Link>

            <div 
              className="z-10" 
              onClick={(e) => e.stopPropagation()}
            >
              <ThemeToggle />
            </div>

            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-full border dark:border-gray-600 hover:shadow-md transition-shadow"
                aria-label="Open user menu"
                aria-expanded={isMenuOpen}
              >
                <Menu className="h-5 w-5 dark:text-white" />
                <div className="relative h-8 w-8 rounded-full overflow-hidden">
                  {user ? (
                    <Image
                      src={user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name.trim())}
                      alt={user.name}
                      fill
                      sizes="32px"
                      className="object-cover"
                      unoptimized={!user.avatar || user.avatar.includes('ui-avatars.com')}
                    />
                  ) : (
                    <User className="h-full w-full p-1 text-gray-600 dark:text-gray-300" />
                  )}
                </div>
              </button>

              {isMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border dark:border-gray-700 py-2"
                  role="menu"
                  aria-orientation="vertical"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b dark:border-gray-700">
                        <p className="font-semibold dark:text-white">{user.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                        {user.role === 'ADMIN' && (
                          <p className="text-xs text-airbnb-rausch font-medium mt-1">Quản trị viên</p>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        Your Profile
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        Your Bookings
                      </Link>
                      
                      <Link
                        href="/favorites"
                        className=" px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700 flex items-center"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        <Heart className="h-4 w-4 mr-2 text-airbnb-rosa" />
                        Danh sách yêu thích
                      </Link>
                      
                      <Link
                        href="/become-host"
                        className="px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700 flex items-center md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        <Home className="w-4 h-4 mr-2 text-airbnb-rosa" />
                        Trở thành chủ nhà
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className=" px-4 py-2 text-airbnb-hof dark:text-white bg-airbnb-foggy dark:bg-gray-700 hover:bg-airbnb-foggy dark:hover:bg-gray-600 flex items-center"
                          onClick={() => setIsMenuOpen(false)}
                          role="menuitem"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-airbnb-rausch" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                          </svg>
                          Admin Dashboard
                        </Link>
                      )}
                      
                      <div className="border-t dark:border-gray-700 mt-2">
                        <button
                          onClick={handleSignOut}
                          className="block w-full text-left px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700"
                          role="menuitem"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/auth/signin"
                        className="block px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        Sign In
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="block px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        Sign Up
                      </Link>
                      
                      <Link
                        href="/become-host"
                        className="block px-4 py-2 text-airbnb-hof dark:text-white hover:bg-airbnb-foggy dark:hover:bg-gray-700 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                        role="menuitem"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Trở thành chủ nhà
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
