import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { Review } from '@/types/review';

interface ReviewsProps {
  reviews: Review[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="mt-8">
      <div className="flex items-center mb-6">
        <FaStar className="text-rose-500 mr-2" size={24} />
        <h2 className="text-2xl font-semibold">
          {reviews.length > 0 
            ? `${reviews.reduce((acc, review) => acc + review.saoBinhLuan, 0) / reviews.length} · ${reviews.length} đánh giá`
            : 'Chưa có đánh giá'}
        </h2>
      </div>
      
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6 mb-6 last:border-0">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <Image
                    src="/images/avatar-placeholder.jpg"
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">User {review.maNguoiDung}</h3>
                  <p className="text-gray-500 text-sm">{formatDate(review.ngayBinhLuan)}</p>
                </div>
              </div>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <FaStar
                    key={index}
                    className={index < review.saoBinhLuan ? 'text-rose-500' : 'text-gray-300'}
                    size={14}
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.noiDung}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Chưa có đánh giá nào cho phòng này.</p>
      )}
    </div>
  );
};

export default Reviews;