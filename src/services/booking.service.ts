import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { Booking, CreateBookingDto } from '@/types';

class BookingService {
  async getBookings(): Promise<ApiResponse<Booking[]>> {
    return axiosInstance.get('/dat-phong');
  }

  async getBookingById(id: number): Promise<ApiResponse<Booking>> {
    return axiosInstance.get(`/dat-phong/${id}`);
  }

  async getBookingsByUser(userId: number): Promise<ApiResponse<Booking[]>> {
    return axiosInstance.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
  }

  async getBookingsByRoom(roomId: number): Promise<ApiResponse<Booking[]>> {
    // Use the correct endpoint for fetching bookings by room ID
    return axiosInstance.get(`/dat-phong/lay-theo-phong/${roomId}`);
  }

  async createBooking(booking: CreateBookingDto): Promise<ApiResponse<Booking>> {
    return axiosInstance.post('/dat-phong', booking);
  }

  async updateBooking(id: number, booking: CreateBookingDto): Promise<ApiResponse<Booking>> {
    return axiosInstance.put(`/dat-phong/${id}`, booking);
  }

  async deleteBooking(id: number): Promise<ApiResponse<null>> {
    return axiosInstance.delete(`/dat-phong/${id}`);
  }

  async cancelBooking(bookingId: number): Promise<ApiResponse<unknown>> {
    try {
      const response = await axiosInstance.delete(`/dat-phong/${bookingId}`);
      return response;
    } catch (error) {
      console.error('Error canceling booking:', error);
      throw error;
    }
  }

  async getUserBookings(userId: number): Promise<ApiResponse<Booking[]>> {
    return axiosInstance.get(`/dat-phong/lay-theo-nguoi-dung/${userId}`);
  }
}

export const bookingService = new BookingService();
