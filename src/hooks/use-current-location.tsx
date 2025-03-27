'use client';

import { useState, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';

interface Coordinates {
  latitude: number | null;
  longitude: number | null;
}

interface LocationData {
  coordinates: Coordinates;
  formattedAddress: string | null;
  loading: boolean;
  error: string | null;
  getLocation: () => Promise<void>;
}

// Định nghĩa interface cho lỗi geolocation
interface GeolocationPositionError {
  code: number;
  message: string;
}

// Giá trị mặc định cho vị trí
const defaultCoordinates = {
  latitude: null,
  longitude: null,
};

export const useCurrentLocation = (): LocationData => {
  const [coordinates, setCoordinates] = useState<Coordinates>(defaultCoordinates);
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Lấy địa chỉ dựa trên tọa độ GPS
  const getAddressFromCoordinates = useCallback(async (latitude: number, longitude: number) => {
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.display_name) {
        setFormattedAddress(data.display_name);
      } else {
        setFormattedAddress(null);
      }
    } catch (error) {
      console.error('Không thể lấy địa chỉ:', error);
      setFormattedAddress(null);
    }
  }, []);

  // Lấy vị trí hiện tại
  const getLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Trình duyệt của bạn không hỗ trợ định vị');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const newCoordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setCoordinates(newCoordinates);
      
      // Lấy địa chỉ từ tọa độ
      await getAddressFromCoordinates(newCoordinates.latitude, newCoordinates.longitude);
      
      toast.success('Đã lấy vị trí hiện tại');
    } catch (error: unknown) {
      console.error('Lỗi lấy vị trí:', error);
      
      let errorMessage = 'Không thể lấy vị trí hiện tại';
      
      if (error instanceof GeolocationPositionError || 
         (typeof error === 'object' && error !== null && 'code' in error)) {
        const geoError = error as GeolocationPositionError;
        if (geoError.code === 1) {
          errorMessage = 'Bạn đã từ chối quyền truy cập vị trí';
        } else if (geoError.code === 2) {
          errorMessage = 'Không thể xác định vị trí, vui lòng thử lại';
        } else if (geoError.code === 3) {
          errorMessage = 'Quá thời gian xác định vị trí';
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getAddressFromCoordinates]);

  // Kết quả trả về được memoized để tránh re-render không cần thiết
  const locationData = useMemo(() => ({
    coordinates,
    formattedAddress,
    loading,
    error,
    getLocation,
  }), [coordinates, formattedAddress, loading, error, getLocation]);

  return locationData;
}; 