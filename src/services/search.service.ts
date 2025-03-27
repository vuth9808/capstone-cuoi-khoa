import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { Room } from '@/types';

class SearchService {
  async searchRooms(query: string): Promise<ApiResponse<Room[]>> {
    try {
      // Nếu không có từ khóa, trả về tất cả phòng
      if (!query || !query.trim()) {
        return axiosInstance.get('/phong-thue');
      }
      
      // Thay vì sử dụng endpoint /search với tham số keyword, chúng ta sẽ lấy tất cả phòng
      // và lọc ở phía client để tránh lỗi 400 Bad Request
      const response = await axiosInstance.get<ApiResponse<Room[]>>('/phong-thue');
      
      // Đảm bảo content là mảng, nếu không thì trả về mảng rỗng
      const allRooms: Room[] = Array.isArray(response.content) ? response.content : [];
      
      // Lọc theo từ khóa tìm kiếm
      const keyword = query.trim().toLowerCase();
      const filteredRooms = allRooms.filter((room: Room) => 
        room.tenPhong.toLowerCase().includes(keyword) ||
        (room.moTa && room.moTa.toLowerCase().includes(keyword))
      );
      
      return {
        statusCode: response.statusCode,
        content: filteredRooms,
        dateTime: response.dateTime,
        message: filteredRooms.length > 0 ? response.message : 'Không tìm thấy kết quả phù hợp'
      };
    } catch (error) {
      console.error('Error searching rooms:', error);
      // Fallback nếu tìm kiếm có lỗi
      return {
        statusCode: 200,
        content: [] as Room[],
        dateTime: new Date().toISOString(),
        message: 'Không tìm thấy kết quả phù hợp'
      };
    }
  }

  async searchRoomsByLocation(locationId: number, query: string): Promise<ApiResponse<Room[]>> {
    try {
      // Nếu không có từ khóa, sử dụng endpoint lấy phòng theo vị trí
      if (!query || !query.trim()) {
        return axiosInstance.get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
      }
      
      // Nếu có từ khóa, sử dụng phương pháp lọc client-side
      // Đầu tiên lấy tất cả phòng theo vị trí
      const response = await axiosInstance.get<ApiResponse<Room[]>>(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
      
      // Đảm bảo content là mảng, nếu không thì trả về mảng rỗng
      const allRooms: Room[] = Array.isArray(response.content) ? response.content : [];
      
      // Sau đó lọc theo từ khóa tìm kiếm
      const keyword = query.trim().toLowerCase();
      const filteredRooms = allRooms.filter((room: Room) => 
        room.tenPhong.toLowerCase().includes(keyword) ||
        (room.moTa && room.moTa.toLowerCase().includes(keyword))
      );
      
      return {
        statusCode: response.statusCode,
        content: filteredRooms,
        dateTime: response.dateTime,
        message: filteredRooms.length > 0 ? response.message : 'Không tìm thấy kết quả phù hợp'
      };
    } catch (error) {
      console.error('Error searching rooms by location:', error);
      // Fallback nếu tìm kiếm có lỗi
      return {
        statusCode: 200,
        content: [] as Room[],
        dateTime: new Date().toISOString(),
        message: 'Không tìm thấy kết quả phù hợp'
      };
    }
  }
}

export const searchService = new SearchService();
