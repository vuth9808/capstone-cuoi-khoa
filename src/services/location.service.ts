import { axiosInstance, ApiResponse } from '@/config/axios.config';
import { Location } from '@/types';

interface LocationPayload extends Omit<Location, 'id'> {
  hinhAnh: string;
}

const validateImageUrl = (url: string): string => {
  if (!url) return '';
  try {
    const validatedUrl = new URL(url);
    if (validatedUrl.protocol === 'https:' && 
        validatedUrl.hostname === 'airbnbnew.cybersoft.edu.vn') {
      return url;
    }
  } catch {}
  return '';
};

export const locationService = {
  getLocations: async (): Promise<ApiResponse<Location[]>> => {
    const response = await axiosInstance.get<Location[]>('/vi-tri');
    // Ensure all locations have valid image URLs
    return {
      ...response,
      content: response.content.map((location: Location) => ({
        ...location,
        hinhAnh: validateImageUrl(location.hinhAnh),
      })),
    };
  },

  getLocationById: async (id: number): Promise<ApiResponse<Location>> => {
    const response = await axiosInstance.get<Location>(`/vi-tri/${id}`);
    // Ensure location has valid image URL
    return {
      ...response,
      content: {
        ...response.content,
        hinhAnh: validateImageUrl(response.content.hinhAnh),
      },
    };
  },

  createLocation: async (payload: LocationPayload): Promise<ApiResponse<Location>> => {
    // Validate image URL before sending to API
    const validatedPayload = {
      ...payload,
      hinhAnh: validateImageUrl(payload.hinhAnh),
    };
    return axiosInstance.post<Location>('/vi-tri', validatedPayload);
  },

  updateLocation: async (id: number, payload: Partial<LocationPayload>): Promise<ApiResponse<Location>> => {
    // Validate image URL if included in payload
    const validatedPayload = payload.hinhAnh ? {
      ...payload,
      hinhAnh: validateImageUrl(payload.hinhAnh),
    } : payload;
    return axiosInstance.put<Location>(`/vi-tri/${id}`, validatedPayload);
  },

  deleteLocation: async (id: number): Promise<ApiResponse<void>> => {
    return axiosInstance.delete<void>(`/vi-tri/${id}`);
  },
};
