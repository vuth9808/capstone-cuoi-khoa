'use client';

import Link from 'next/link';
import { Globe, Facebook, Twitter, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

// Mock data for footer
const footerData = {
  support: [
    { label: 'Trung tâm hỗ trợ', href: '#' },
    { label: 'Liên hệ với chúng tôi', href: '#' },
    { label: 'Chính sách hủy phòng', href: '#' },
    { label: 'Thông tin an toàn', href: '#' },
    { label: 'Thư viện Animation', href: '/animation-examples' },
  ],
  hosting: [
    { label: 'Trở thành chủ nhà', href: '/become-host' },
    { label: 'Đón tiếp khách có trách nhiệm', href: '#' },
    { label: 'Tài nguyên cho chủ nhà', href: '#' },
    { label: 'Diễn đàn cộng đồng', href: '#' },
  ],
  company: [
    { label: 'Giới thiệu', href: '#' },
    { label: 'Cơ hội nghề nghiệp', href: '#' },
    { label: 'Nhà đầu tư', href: '#' },
    { label: 'Tin tức', href: '#' },
  ],
  policies: [
    { label: 'Điều khoản sử dụng', href: '#' },
    { label: 'Chính sách riêng tư', href: '#' },
    { label: 'Cài đặt cookie', href: '#' },
    { label: 'Sơ đồ trang', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-bg-primary dark:bg-[#1D1D1D] border-t border-border dark:border-[#383838] pt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Support section */}
          <div className="animate__animated animate__fadeInUp animate__delay-1s">
            <h3 className="text-text-primary dark:text-white font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-3">
              {footerData.support.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Hosting section */}
          <div className="animate__animated animate__fadeInUp animate__delay-2s">
            <h3 className="text-text-primary dark:text-white font-semibold mb-4">Đón tiếp khách</h3>
            <ul className="space-y-3">
              {footerData.hosting.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company section */}
          <div className="animate__animated animate__fadeInUp animate__delay-3s">
            <h3 className="text-text-primary dark:text-white font-semibold mb-4">Công ty</h3>
            <ul className="space-y-3">
              {footerData.company.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Policies section */}
          <div className="animate__animated animate__fadeInUp animate__delay-4s">
            <h3 className="text-text-primary dark:text-white font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-3">
              {footerData.policies.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-text-secondary dark:text-[#B0B0B0] hover:text-text-primary dark:hover:text-white transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Language and currency */}
        <div className="py-6 border-t border-border dark:border-[#383838] animate__animated animate__fadeIn animate__delay-5s">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex flex-wrap gap-4 mb-4 md:mb-0">
              <button className="flex items-center text-text-primary dark:text-white hover:underline animate__animated animate__pulse animate__slower animate__infinite">
                <Globe className="h-4 w-4 mr-2" />
                Tiếng Việt
              </button>
              <button className="text-text-primary dark:text-white hover:underline">₫ VND</button>
            </div>
            
            <div className="flex gap-4">
              <a href="#" className="text-text-primary dark:text-white hover:text-primary animate__animated animate__pulse animate__slower">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-primary dark:text-white hover:text-primary animate__animated animate__pulse animate__slower">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-primary dark:text-white hover:text-primary animate__animated animate__pulse animate__slower">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-primary dark:text-white hover:text-primary animate__animated animate__pulse animate__slower">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-primary dark:text-white hover:text-primary animate__animated animate__pulse animate__slower">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-text-primary dark:text-white hover:text-primary animate__animated animate__pulse animate__slower">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="py-6 text-center text-text-secondary dark:text-[#B0B0B0] text-sm animate__animated animate__fadeIn animate__delay-5s">
          &copy; {new Date().getFullYear()} Airbnb, Inc. Đã đăng ký bản quyền.
        </div>
      </div>
    </footer>
  );
} 