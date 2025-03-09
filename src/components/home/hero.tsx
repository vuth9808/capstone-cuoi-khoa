import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';

const Hero = () => {
  return (
    <div className="relative w-full h-[500px] bg-gray-900">
      {/* Background Image sẽ được thay thế bằng hình ảnh thực tế */}
      
      <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
      
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-lg">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Khám phá những chỗ ở tuyệt vời trên thế giới
            </h1>
            <p className="text-xl text-white mb-8">
              Tìm những nơi lưu trú độc đáo và trải nghiệm địa phương ở mọi nơi trên thế giới.
            </p>
            <Button size="lg">
              Khám phá ngay
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;