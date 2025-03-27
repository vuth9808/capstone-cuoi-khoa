'use client';

import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Thanh toán thất bại
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đã có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
          >
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
} 