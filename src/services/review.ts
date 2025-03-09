import api from '../utils/fetcher';
import { Review } from '../types/review';

export const getRoomReviews = async (roomId: string) => {
  const response = await api.get(`/binh-luan/lay-binh-luan-theo-phong/${roomId}`);
  return response.data;
};

export const createReview = async (reviewData: Omit<Review, 'id'>) => {
  const response = await api.post('/binh-luan', reviewData);
  return response.data;
};