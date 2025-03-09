import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:underline">Trung tâm trợ giúp</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">AirCover</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Chống phân biệt đối xử</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Hỗ trợ người khuyết tật</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Các tùy chọn hủy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Cộng đồng</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:underline">Airbnb.org: nhà ở cứu trợ</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Hỗ trợ người tị nạn Afghanistan</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Chống phân biệt đối xử</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Đón tiếp khách</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:underline">Cho thuê nhà trên Airbnb</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">AirCover cho Chủ nhà</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Tài nguyên về đón tiếp khách</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Diễn đàn cộng đồng</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-900 mb-4">Airbnb</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:underline">Tin tức</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Tính năng mới</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Cơ hội nghề nghiệp</Link></li>
              <li><Link href="#" className="text-gray-600 hover:underline">Nhà đầu tư</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <div className="text-gray-600 mb-4 md:mb-0">
            © {new Date().getFullYear()} Airbnb Clone, Inc.
          </div>
          <div className="flex space-x-6">
            <Link href="#" className="text-gray-600 hover:underline">Quyền riêng tư</Link>
            <Link href="#" className="text-gray-600 hover:underline">Điều khoản</Link>
            <Link href="#" className="text-gray-600 hover:underline">Sơ đồ trang web</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;