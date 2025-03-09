import api from '../utils/fetcher';
import { Booking } from '../types/booking';

export const createBooking = async (bookingData: Omit<Booking, 'id'>) => {
  const response = await api.post('/dat-phong', bookingData);
  return response.data;
};

export const getUserBookings = async (userId: string) => {
  const response = await api.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
  return response.data;
};