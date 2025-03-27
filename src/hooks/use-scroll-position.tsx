'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

// Hàm debounce để giảm thiểu số lần cập nhật
const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F, 
  wait: number
): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return (...args: Parameters<F>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useScrollPosition = (delay: number = 10): ScrollPosition => {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  // Tạo hàm cập nhật vị trí scroll với useCallback để tránh tạo lại hàm
  const updatePosition = useCallback(() => {
    setScrollPosition({
      x: window.scrollX,
      y: window.scrollY
    });
  }, []);

  useEffect(() => {
    // Chỉ chạy ở môi trường client side
    if (typeof window === 'undefined') return;

    // Tạo hàm debounced trong useEffect để tránh cảnh báo exhaustive-deps
    const debouncedUpdatePosition = debounce(updatePosition, delay);

    // Cập nhật vị trí ban đầu
    updatePosition();

    // Thêm event listener với hàm đã được debounce
    window.addEventListener('scroll', debouncedUpdatePosition, { passive: true });

    // Cleanup function để tránh memory leak
    return () => {
      window.removeEventListener('scroll', debouncedUpdatePosition);
    };
  }, [updatePosition, delay]);

  return scrollPosition;
}; 