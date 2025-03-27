'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, CreditCard, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function MomoSandboxPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  // Lấy thông tin từ query params
  const orderId = searchParams.get('orderId') || 'ORDER_12345';
  const amount = searchParams.get('amount') || '100000';
  const orderInfo = searchParams.get('orderInfo') || 'Đặt phòng';

  useEffect(() => {
    if (isPaymentComplete) {
      const timer = setTimeout(() => {
        if (countdown > 0) {
          setCountdown(countdown - 1);
        } else {
          router.push('/bookings');
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, isPaymentComplete, router]);

  const handlePayment = () => {
    setIsPaymentComplete(true);
  };

  if (isPaymentComplete) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-center">
        <div className="bg-pink-600 text-white py-4 px-6 flex items-center">
          <div className="flex-1 text-center font-semibold text-lg">MoMo Sandbox</div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <div className="flex flex-col items-center">
            <CheckCircle className="w-20 h-20 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold">Thanh toán thành công</h2>
            <p className="text-gray-600 mt-2">Đơn hàng {orderId} đã được thanh toán</p>
            <p className="text-gray-600">Số tiền: {parseInt(amount).toLocaleString('vi-VN')}đ</p>
          </div>

          <div className="mt-6 text-gray-600">
            <p>Tự động chuyển hướng sau {countdown} giây</p>
          </div>

          <button
            onClick={() => router.push('/bookings')}
            className="bg-pink-600 text-white py-2 px-6 rounded-full font-medium"
          >
            Tiếp tục
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="bg-pink-600 text-white py-4 px-6 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="flex-1 text-center font-semibold text-lg">MoMo Sandbox</div>
      </div>

      <div className="p-6">
        <div className="mb-6 bg-pink-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Đơn hàng</p>
              <p className="text-xl font-semibold">{orderInfo}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-700 font-medium">Số tiền</p>
              <p className="text-xl font-semibold text-pink-600">{parseInt(amount).toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
          <div className="border rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 flex-shrink-0 mr-4 relative">
              <div className="bg-pink-600 rounded-full w-full h-full flex items-center justify-center">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                >
                  <path 
                    d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 5C13.66 5 15 6.34 15 8C15 9.66 13.66 11 12 11C10.34 11 9 9.66 9 8C9 6.34 10.34 5 12 5ZM12 19.2C9.5 19.2 7.29 17.92 6 15.98C6.03 13.99 10 12.9 12 12.9C13.99 12.9 17.97 13.99 18 15.98C16.71 17.92 14.5 19.2 12 19.2Z" 
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-medium">MoMo Sandbox</p>
              <p className="text-gray-600 text-sm">Thanh toán qua ví MoMo</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Mã đơn hàng</span>
              <span className="font-medium">{orderId}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Nội dung</span>
              <span className="font-medium">{orderInfo}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Thời gian</span>
              <span className="font-medium">{new Date().toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg text-pink-600">
              <span>Tổng tiền</span>
              <span>{parseInt(amount).toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium flex items-center justify-center"
        >
          <CreditCard className="w-5 h-5 mr-2" />
          Thanh toán
        </button>

        <div className="mt-4 text-center">
          <Link href="/payment/failed" className="text-gray-500 text-sm">
            Hủy giao dịch
          </Link>
        </div>
      </div>
    </div>
  );
} 