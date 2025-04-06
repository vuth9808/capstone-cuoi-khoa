import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layout/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Airbnb',
  description: 'A modern Airbnb built with Next.js and TypeScript',
  // Thêm stylesheet từ CDN, không hoạt động trong Next.js App Router - chỉ để minh họa
  // Chúng ta sẽ sử dụng cách khác ở dưới
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-bg-primary dark:bg-[#121212] text-text-primary dark:text-white`} suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
