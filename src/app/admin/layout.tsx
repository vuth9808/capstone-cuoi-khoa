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
  Moon,
  Sun,
  DollarSign
} from 'lucide-react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { useAuthStore } from '@/store/auth.store';
import { useTheme } from '@/contexts/theme.context';

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
  const { theme, toggleTheme } = useTheme();
  
  
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
    { href: '/admin/revenue', label: 'Doanh thu', icon: DollarSign },
    { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary dark:bg-[#121212] flex">
      {/* Sidebar backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-bg-primary dark:bg-[#1D1D1D] shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen border-r border-border dark:border-[#383838]`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-border dark:border-[#383838]">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="https://cdn.brandfetch.io/idkuvXnjOH/theme/dark/symbol.svg?c=1dxbfHSJFAPEGdCLU4o5B"
                  alt="Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-text-primary dark:text-white">Quản Trị</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* User info */}
          <div className="p-6 border-b border-border dark:border-[#383838]">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 rounded-full overflow-hidden bg-bg-secondary dark:bg-[#383838]">
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
                <p className="font-medium text-text-primary dark:text-white">{user.name}</p>
                <p className="text-xs text-text-secondary dark:text-[#B0B0B0]">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</p>
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
                      ? 'bg-primary text-white shadow-md'
                      : 'text-text-secondary dark:text-[#B0B0B0] hover:bg-bg-secondary dark:hover:bg-[#2A2A2A] hover:text-text-primary dark:hover:text-white'
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
          <div className="p-4 border-t border-border dark:border-[#383838] mt-auto">
            <button
              onClick={() => signOut()}
              className="flex items-center w-full px-4 py-2 text-text-secondary dark:text-[#B0B0B0] rounded-lg hover:bg-bg-secondary dark:hover:bg-[#2A2A2A] hover:text-text-primary dark:hover:text-white transition-colors"
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
        <header className="bg-bg-primary dark:bg-[#1D1D1D] shadow-sm z-10 border-b border-border dark:border-[#383838]">
          <div className="px-6 h-16 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white mr-4"
              >
                <Menu size={24} />
              </button>
              <div className="text-xl font-semibold text-text-primary dark:text-white hidden md:block">
                {navLinks.find(link => link.href === pathname)?.label || 'Quản Trị'}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white rounded-full hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              
             
              
             
              
              {/* Return to site */}
              <Link 
                href="/"
                className="hidden md:flex text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white text-sm font-medium items-center px-3 py-2 rounded hover:bg-bg-secondary dark:hover:bg-[#2A2A2A]"
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
        <footer className="bg-bg-primary dark:bg-[#1D1D1D] border-t py-3 px-6">
          <div className="text-sm text-text-secondary dark:text-[#B0B0B0] text-center">
            &copy; {new Date().getFullYear()} Surf - Hệ thống quản lý phòng. Đã đăng nhập với vai trò {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}.
          </div>
        </footer>
      </div>
    </div>
  );
}
