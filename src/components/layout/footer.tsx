import Link from 'next/link';
import { Facebook, Twitter, Instagram, Globe } from 'lucide-react';

const footerLinks = [
  {
    category: 'Hỗ trợ',
    links: [
      { title: 'Trung tâm trợ giúp', href: '#' },
      { title: 'AirCover', href: '#' },
      { title: 'Chống phân biệt đối xử', href: '#' },
      { title: 'Hỗ trợ người khuyết tật', href: '#' },
      { title: 'Chính sách hủy', href: '#' }
    ]
  },
  {
    category: 'Cộng đồng',
    links: [
      { title: 'Airbnb.org: chỗ ở cứu trợ', href: '#' },
      { title: 'Chống phân biệt đối xử', href: '#' },
      { title: 'Tiêu chuẩn cộng đồng', href: '#' }
    ]
  },
  {
    category: 'Đón tiếp khách',
    links: [
      { title: 'Cho thuê nhà trên Airbnb', href: '/become-host' },
      { title: 'AirCover cho chủ nhà', href: '#' },
      { title: 'Tài nguyên cho chủ nhà', href: '#' },
      { title: 'Diễn đàn cộng đồng', href: '#' }
    ]
  },
  {
    category: 'Airbnb',
    links: [
      { title: 'Về chúng tôi', href: '#' },
      { title: 'Tuyển dụng', href: '#' },
      { title: 'Tin tức', href: '#' },
      { title: 'Nhà đầu tư', href: '#' },
      { title: 'Chương trình Affiliate', href: '#' }
    ]
  }
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-airbnb-foggy dark:bg-gray-800 pt-8 pb-6 border-t dark:border-gray-700">
      <div className="container mx-auto px-4">
        {/* Footer links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h4 className="text-airbnb-hof dark:text-white font-semibold mb-4">{section.category}</h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-gray-600 dark:text-gray-300 hover:text-airbnb-rosa hover:underline text-sm"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-6"></div>

        {/* Footer bottom */}
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              &copy; {currentYear} Airbnb Clone
            </p>
            <div className="flex space-x-4 md:space-x-3 my-2 md:my-0">
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-airbnb-rosa hover:underline">Quyền riêng tư</Link>
              <span className="text-gray-600 dark:text-gray-400 hidden md:inline">&middot;</span>
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-airbnb-rosa hover:underline">Điều khoản</Link>
              <span className="text-gray-600 dark:text-gray-400 hidden md:inline">&middot;</span>
              <Link href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:text-airbnb-rosa hover:underline">Sơ đồ trang web</Link>
            </div>
          </div>

          <div className="flex items-center mt-4 md:mt-0 space-x-6">
            <div className="flex items-center text-airbnb-hof dark:text-white">
              <Globe className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Tiếng Việt (VN)</span>
            </div>

            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-airbnb-hof dark:text-gray-300 hover:text-airbnb-rosa">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Twitter" className="text-airbnb-hof dark:text-gray-300 hover:text-airbnb-rosa">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" aria-label="Instagram" className="text-airbnb-hof dark:text-gray-300 hover:text-airbnb-rosa">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 