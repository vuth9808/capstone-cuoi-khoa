'use client';

import { useQuery } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { userService } from '@/services/user.service';
import { Star } from 'lucide-react';
import { format } from 'date-fns';
import ReviewForm from './review-form';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/contexts/toast.context';
import Image from 'next/image';
import { User, Review } from '@/types';
import { getValidImageUrl } from '@/utils/image';
import { ApiResponse } from '@/config/axios.config';

interface ReviewListProps {
  roomId: number;
}

export default function ReviewList({ roomId }: ReviewListProps) {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();

  const { data: reviewsData, refetch } = useQuery({
    queryKey: ['reviews', roomId],
    queryFn: () => reviewService.getReviewsByRoom(roomId),
  });

  const reviews: Review[] = reviewsData?.content || [];

  // Fetch user details for each review
  const { data: usersData, isLoading: isLoadingUsers, error: usersError } = useQuery({
    queryKey: ['review-users', reviews.map((r) => r.maNguoiBinhLuan)],
    queryFn: async () => {
      const uniqueUserIds = [...new Set(reviews.map((r) => r.maNguoiBinhLuan))].filter(Boolean);
      if (uniqueUserIds.length === 0) return [];
      
      const users = await Promise.all(
        uniqueUserIds.map(async (userId) => {
          try {
            return await userService.getUserById(userId);
          } catch (error) {
            console.error(`Failed to fetch user ${userId}:`, error);
            return null;
          }
        })
      );
      return users
        .filter((response): response is ApiResponse<User> => response !== null)
        .map((response) => response.content);
    },
    enabled: reviews.length > 0,
  });

  const users = usersData || [];
  const usersMap = users.reduce((map, user) => {
    if (user && user.id) {
      map[user.id] = user;
    }
    return map;
  }, {} as Record<number, User>);
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.saoBinhLuan, 0) / reviews.length
      : 0;

  if (!reviewsData || isLoadingUsers) {
    return <LoadingSpinner />;
  }

  if (usersError) {
    return <div>Error loading users: {usersError.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Reviews ({reviews.length})
            {reviews.length > 0 && (
              <span className="text-gray-600 text-lg ml-2">
                {averageRating.toFixed(1)} out of 5
              </span>
            )}
          </h2>
          <button
            onClick={() => refetch()}
            className="text-primary-600 hover:text-primary-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh reviews
          </button>
        </div>

        {user && (
          <div className="mb-8">
            <ReviewForm
              roomId={roomId}
              userId={user.id}
              onSuccess={() => {
                refetch();
                showSuccess('Review submitted successfully!');
              }}
            />
          </div>
        )}

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4">
            {reviews.map((review) => {
              const reviewUser = usersMap[review.maNguoiBinhLuan];
              if (!reviewUser) return null;

              return (
                <div key={review.id} className="border-b pb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                      <Image
                        src={reviewUser.avatar ? getValidImageUrl(reviewUser.avatar, 'avatar') : `https://ui-avatars.com/api/?name=${encodeURIComponent(reviewUser.name.trim())}`}
                        alt={reviewUser.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized={!reviewUser.avatar || (typeof reviewUser.avatar === 'string' && reviewUser.avatar.includes('ui-avatars.com'))}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{reviewUser.name}</p>
                      <p className="text-gray-600 text-sm">
                        {format(new Date(review.ngayBinhLuan), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 mb-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-4 w-4 ${
                          index < review.saoBinhLuan
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-gray-800 whitespace-pre-line">
                    {review.noiDung}
                  </p>

                  {user?.id === review.maNguoiBinhLuan && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this review?')) {
                            try {
                              await reviewService.deleteReview(review.id);
                              showSuccess('Review deleted successfully');
                              refetch();
                            } catch (error: unknown) {
                              showError(
                                error instanceof Error
                                  ? error.message
                                  : 'Failed to delete review'
                              );
                            }
                          }
                        }}
                        className="text-sm text-rose-500 hover:text-rose-600"
                      >
                        Delete review
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
