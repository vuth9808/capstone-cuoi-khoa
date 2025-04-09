import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { Room } from '@/types';

export const roomService = {
  getRooms: async (): Promise<ApiResponse<Room[]>> => {
    return axiosInstance.get('/phong-thue');
  },

  getRoomById: async (id: number): Promise<ApiResponse<Room>> => {
    return axiosInstance.get(`/phong-thue/${id}`);
  },

  getRoomsByLocationId: async (locationId: number): Promise<ApiResponse<Room[]>> => {
    return axiosInstance.get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
  },

  searchRooms: async (keyword: string): Promise<ApiResponse<Room[]>> => {
    // Nếu keyword rỗng, trả về tất cả phòng
    if (!keyword || keyword.trim() === '') {
      return roomService.getRooms();
    }
    
    try {
      // Encode keyword để tránh các ký tự đặc biệt
      const encodedKeyword = encodeURIComponent(keyword.trim());
      return axiosInstance.get(`/phong-thue/search?keyword=${encodedKeyword}`);
    } catch (error) {
      console.error('Error searching rooms:', error);
      // Nếu có lỗi, trả về danh sách phòng rỗng với thông báo lỗi
      return {
        statusCode: 200,
        content: [],
        dateTime: new Date().toISOString(),
        message: 'Không tìm thấy kết quả phù hợp'
      };
    }
  },

  createRoom: async (payload: Omit<Room, 'id'>): Promise<ApiResponse<Room>> => {
    try {
      console.log('Creating room with payload:', payload);
      
      // Kiểm tra token trước khi gửi request
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      const response = await axiosInstance.post<Room>('/phong-thue', payload);
      console.log('Room creation response:', response);
      return response;
    } catch (error) {
      console.error('Room creation error details:', error);
      
      // Nếu là lỗi token, ném lỗi để component xử lý
      if (error instanceof Error && (error.message.includes('token') || error.message.includes('đăng nhập'))) {
        throw error;
      }
      
      throw new Error('Có lỗi xảy ra khi tạo phòng. Vui lòng thử lại sau.');
    }
  },

  updateRoom: async (id: number, payload: Partial<Room>): Promise<ApiResponse<Room>> => {
    return axiosInstance.put(`/phong-thue/${id}`, payload);
  },

  deleteRoom: async (id: number): Promise<ApiResponse<void>> => {
    const token = localStorage.getItem('token');
    console.log('Token used for deleteRoom:', token);
    return axiosInstance.delete(`/phong-thue/${id}`);
  },
};
