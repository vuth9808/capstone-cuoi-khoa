'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { 
  Home, 
  MapPin, 
  Users, 
  LayoutDashboard, 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Bell
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useAuthStore } from '@/store/auth.store';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isChecking } = useAdminAuth();
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { signOut } = useAuthStore();
  const [notifications] = useState([
    { id: 1, message: 'New user registered', time: '2 mins ago' },
    { id: 2, message: 'New booking request', time: '1 hour ago' },
    { id: 3, message: 'Server error occurred', time: '2 hours ago' },
  ]);
  
  // Xác định nếu đang ở trang đăng nhập admin
  const isAuthPage = pathname === '/admin/auth';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Nếu đang ở trang auth, hiển thị nội dung không cần layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  if (!mounted || isChecking || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const navLinks = [
    { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/admin/rooms', label: 'Phòng', icon: Home },
    { href: '/admin/locations', label: 'Vị trí', icon: MapPin },
    { href: '/admin/users', label: 'Người dùng', icon: Users },
    { href: '/admin/bookings', label: 'Đặt phòng', icon: Home },
    { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 h-16 border-b">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-gray-900">Quản Trị</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                <Image
                  src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name.trim())}`}
                  alt={user.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  unoptimized={!user.avatar || user.avatar.includes('ui-avatars.com')}
                />
              </div>
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-rose-500 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout button */}
          <div className="p-4 border-t mt-auto">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-gray-500 hover:text-gray-700 mr-4"
              >
                <Menu size={24} />
              </button>
              <div className="text-xl font-semibold text-gray-800 hidden md:block">
                {navLinks.find(link => link.href === pathname)?.label || 'Quản Trị'}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                  <Bell size={20} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Settings */}
              <button className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
                <Settings size={20} />
              </button>
              
              {/* Return to site */}
              <Link 
                href="/"
                className="hidden md:flex text-gray-600 hover:text-gray-900 text-sm font-medium items-center px-3 py-2 rounded hover:bg-gray-100"
              >
                <Home className="h-4 w-4 mr-2" />
                Về trang chủ
              </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t py-3 px-6">
          <div className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Surf - Hệ thống quản lý phòng. Đã đăng nhập với vai trò {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}.
          </div>
        </footer>
      </div>
    </div>
  );
}
