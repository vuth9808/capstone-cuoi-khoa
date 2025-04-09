'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';
import Image from 'next/image';
import { DollarSign, Calendar, Shield, User } from 'lucide-react';

const hostSchema = z.object({
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 số'),
  address: z.string().min(1, 'Vui lòng nhập địa chỉ'),
  reason: z.string().min(10, 'Vui lòng nhập lý do với ít nhất 10 ký tự'),
});

type HostFormValues = z.infer<typeof hostSchema>;

export default function BecomeHostPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<HostFormValues>({
    resolver: zodResolver(hostSchema),
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      reason: '',
    }
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Giả lập gửi yêu cầu
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
      router.push('/host/dashboard');
    } catch {
      toast.error('Có lỗi xảy ra khi đăng ký.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <div className="relative h-96 lg:h-[500px]">
        <Image
          src="https://s3.ap-southeast-1.amazonaws.com/cdn.vntre.vn/default/airbnb-la-gi-4-1726623915.jpg"
          alt="Become a host"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Trở thành chủ nhà</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Hãy chia sẻ không gian của bạn, tạo thêm thu nhập và kết nối với du khách trên khắp thế giới.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form Section */}
          <div className="order-2 lg:order-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Đăng ký trở thành chủ nhà</h2>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    {...register('fullName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tại sao bạn muốn trở thành chủ nhà?
                  </label>
                  <textarea
                    rows={4}
                    {...register('reason')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                  />
                  {errors.reason && (
                    <p className="mt-1 text-sm text-red-600">{errors.reason.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 disabled:opacity-50"
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Đăng ký ngay'}
                </button>
              </form>
              
              <p className="mt-4 text-sm text-center text-gray-600">
                Bạn đã là chủ nhà? {' '}
                <Link href="/host/dashboard" className="font-medium text-rose-600 hover:text-rose-500">
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl font-bold mb-6">Lợi ích khi trở thành chủ nhà</h2>
            
            <div className="space-y-8">
              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Thu nhập thêm</h3>
                  <p className="text-gray-600">
                    Biến không gian trống của bạn thành nguồn thu nhập ổn định. Nhiều chủ nhà dùng khoản thu này để trang trải chi phí sinh hoạt, tiết kiệm cho các dự định tương lai.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Linh hoạt</h3>
                  <p className="text-gray-600">
                    Bạn hoàn toàn kiểm soát lịch, giá cả và quy tắc cho thuê. Cho thuê khi bạn muốn, chặn những ngày bạn không thể.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">An toàn và bảo vệ</h3>
                  <p className="text-gray-600">
                    Chúng tôi xác minh danh tính khách hàng, cung cấp bảo hiểm thiệt hại và hỗ trợ 24/7 cho chủ nhà.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-rose-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Kết nối toàn cầu</h3>
                  <p className="text-gray-600">
                    Gặp gỡ và kết nối với du khách từ khắp nơi trên thế giới, chia sẻ văn hóa và tạo dựng những trải nghiệm đáng nhớ.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <h3 className="text-lg font-semibold mb-3">Quy trình trở thành chủ nhà</h3>
              <ol className="space-y-2">
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <span>Đăng ký thông tin của bạn qua biểu mẫu</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <span>Chúng tôi sẽ liên hệ để xác nhận thông tin</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <span>Thiết lập không gian và đăng tải ảnh chụp</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  <span>Bắt đầu đón tiếp khách và kiếm thu nhập</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 