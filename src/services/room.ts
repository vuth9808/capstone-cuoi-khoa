import api from '../utils/fetcher';
import { Room } from '../types/room';

export const getRooms = async (params?: any) => {
  const response = await api.get('/phong-thue', { params });
  return response.data;
};

export const getRoomById = async (id: string) => {
  const response = await api.get(`/phong-thue/${id}`);
  return response.data;
};

export const getLocationRooms = async (locationId: string) => {
  const response = await api.get(`/phong-thue/lay-phong-theo-vi-tri?maViTri=${locationId}`);
  return response.data;
};
