import api from '../utils/fetcher';
import { Location } from '../types/location';

export const getLocations = async (params?: any) => {
  const response = await api.get('/vi-tri', { params });
  return response.data;
};

export const getLocationById = async (id: string) => {
  const response = await api.get(`/vi-tri/${id}`);
  return response.data;
};