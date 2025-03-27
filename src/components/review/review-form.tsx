'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { reviewService } from '@/services/review.service';
import { CreateReviewDto } from '@/types';

// Định nghĩa type cho form values để khớp với CreateReviewDto
type ReviewFormValues = CreateReviewDto;

const reviewSchema = z.object({
  maPhong: z.number(),
  maNguoiBinhLuan: z.number(),
  noiDung: z.string().min(1, 'Vui lòng nhập nội dung đánh giá'),
  saoBinhLuan: z.number().min(1, 'Vui lòng chọn số sao').max(5),
  ngayBinhLuan: z.string(),
});

type ReviewFormProps = {
  roomId: number;
  userId: number;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export default function ReviewForm({ roomId, userId, onSuccess, onError }: ReviewFormProps) {
  const [hover, setHover] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      maPhong: roomId,
      maNguoiBinhLuan: userId,
      saoBinhLuan: 0,
      noiDung: '',
      ngayBinhLuan: new Date().toISOString(),
    },
  });

  const rating = watch('saoBinhLuan');

  const handleRatingClick = (value: number) => {
    setValue('saoBinhLuan', value, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormValues) => {
    try {
      // Cập nhật ngày bình luận mới nhất trước khi gửi
      const updatedData = {
        ...data,
        ngayBinhLuan: new Date().toISOString(),
      };

      console.log('Submitting review:', updatedData);
      const response = await reviewService.createReview(updatedData);
      console.log('Review response:', response);
      if (response.statusCode === 200 || response.statusCode === 201) {
        reset();
        onSuccess?.();
      } else {
        throw new Error(response.message || 'Có lỗi xảy ra khi gửi đánh giá');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      onError?.(error as Error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đánh giá của bạn
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="focus:outline-none"
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hover || rating)
                    ? 'text-amber-500 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {rating > 0 ? `${rating} sao` : 'Chọn số sao'}
          </span>
        </div>
        {errors.saoBinhLuan && (
          <p className="mt-1 text-sm text-red-600">
            {errors.saoBinhLuan.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="noiDung"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nội dung đánh giá
        </label>
        <textarea
          id="noiDung"
          {...register('noiDung')}
          rows={4}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 sm:text-sm"
          placeholder="Chia sẻ trải nghiệm của bạn về căn phòng này..."
        />
        {errors.noiDung && (
          <p className="mt-1 text-sm text-red-600">{errors.noiDung.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 disabled:opacity-50"
      >
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </button>
    </form>
  );
}
