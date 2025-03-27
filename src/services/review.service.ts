import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { Review, CreateReviewDto } from '@/types';

class ReviewService {
  async getReviews(): Promise<ApiResponse<Review[]>> {
    return axiosInstance.get('/binh-luan');
  }

  async getReviewById(id: number): Promise<ApiResponse<Review>> {
    return axiosInstance.get(`/binh-luan/${id}`);
  }

  async getReviewsByRoom(roomId: number): Promise<ApiResponse<Review[]>> {
    return axiosInstance.get(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
  }

  async createReview(review: CreateReviewDto): Promise<ApiResponse<Review>> {
    return axiosInstance.post('/binh-luan', review);
  }

  async updateReview(id: number, review: CreateReviewDto): Promise<ApiResponse<Review>> {
    return axiosInstance.put(`/binh-luan/${id}`, review);
  }

  async deleteReview(id: number): Promise<ApiResponse<null>> {
    return axiosInstance.delete(`/binh-luan/${id}`);
  }
}

export const reviewService = new ReviewService();
