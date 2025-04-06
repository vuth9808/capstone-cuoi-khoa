'use client';

import { useState } from 'react';
import { AnimationTypes, animateElement } from '@/utils/animation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function AnimationExamplesPage() {
  const [selectedAnimation, setSelectedAnimation] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAnimationClick = (animationType: string) => {
    setSelectedAnimation(animationType);
    const demoElement = document.getElementById('animation-demo');
    
    if (demoElement && !isPlaying) {
      setIsPlaying(true);
      animateElement(demoElement, animationType).then(() => {
        setIsPlaying(false);
      });
    }
  };

  // Nhóm animation theo loại
  const animationGroups = {
    'Chú ý': [
      { name: 'Bounce', value: AnimationTypes.BOUNCE },
      { name: 'Flash', value: AnimationTypes.FLASH },
      { name: 'Pulse', value: AnimationTypes.PULSE },
      { name: 'Rubber Band', value: AnimationTypes.RUBBER_BAND },
      { name: 'Shake X', value: AnimationTypes.SHAKE_X },
      { name: 'Shake Y', value: AnimationTypes.SHAKE_Y }, 
      { name: 'Head Shake', value: AnimationTypes.HEAD_SHAKE },
      { name: 'Swing', value: AnimationTypes.SWING },
      { name: 'Tada', value: AnimationTypes.TADA },
      { name: 'Wobble', value: AnimationTypes.WOBBLE },
      { name: 'Jello', value: AnimationTypes.JELLO },
      { name: 'Heart Beat', value: AnimationTypes.HEART_BEAT },
    ],
    'Hiện vào': [
      { name: 'Fade In', value: AnimationTypes.FADE_IN },
      { name: 'Fade In Down', value: AnimationTypes.FADE_IN_DOWN },
      { name: 'Fade In Left', value: AnimationTypes.FADE_IN_LEFT },
      { name: 'Fade In Right', value: AnimationTypes.FADE_IN_RIGHT },
      { name: 'Fade In Up', value: AnimationTypes.FADE_IN_UP },
    ],
    'Biến mất': [
      { name: 'Fade Out', value: AnimationTypes.FADE_OUT },
      { name: 'Fade Out Down', value: AnimationTypes.FADE_OUT_DOWN },
      { name: 'Fade Out Left', value: AnimationTypes.FADE_OUT_LEFT },
      { name: 'Fade Out Right', value: AnimationTypes.FADE_OUT_RIGHT },
      { name: 'Fade Out Up', value: AnimationTypes.FADE_OUT_UP },
    ],
    'Thu phóng': [
      { name: 'Zoom In', value: AnimationTypes.ZOOM_IN },
      { name: 'Zoom In Down', value: AnimationTypes.ZOOM_IN_DOWN },
      { name: 'Zoom In Left', value: AnimationTypes.ZOOM_IN_LEFT },
      { name: 'Zoom In Right', value: AnimationTypes.ZOOM_IN_RIGHT },
      { name: 'Zoom In Up', value: AnimationTypes.ZOOM_IN_UP },
      { name: 'Zoom Out', value: AnimationTypes.ZOOM_OUT },
      { name: 'Zoom Out Down', value: AnimationTypes.ZOOM_OUT_DOWN },
      { name: 'Zoom Out Left', value: AnimationTypes.ZOOM_OUT_LEFT },
      { name: 'Zoom Out Right', value: AnimationTypes.ZOOM_OUT_RIGHT },
      { name: 'Zoom Out Up', value: AnimationTypes.ZOOM_OUT_UP },
    ],
    'Đặc biệt': [
      { name: 'Hinge', value: AnimationTypes.HINGE },
      { name: 'Jack In The Box', value: AnimationTypes.JACK_IN_THE_BOX },
      { name: 'Roll In', value: AnimationTypes.ROLL_IN },
      { name: 'Roll Out', value: AnimationTypes.ROLL_OUT },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link href="/" className="inline-flex items-center mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>Quay lại trang chủ</span>
          </Link>
          <h1 className="text-3xl font-bold text-center flex-1">Thư viện Animation</h1>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="mb-8 flex flex-col items-center justify-center">
            <div 
              id="animation-demo" 
              className="w-32 h-32 bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg flex items-center justify-center mb-4"
            >
              <span className="text-white font-bold text-lg">Demo</span>
            </div>
            <p className="text-lg">
              {selectedAnimation ? `Animation hiện tại: ${selectedAnimation}` : 'Chọn một animation để xem demo'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(animationGroups).map(([groupName, animations]) => (
              <div key={groupName} className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-rose-600">{groupName}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {animations.map((animation) => (
                    <button
                      key={animation.value}
                      className={`py-2 px-4 rounded-md text-left transition-colors ${
                        selectedAnimation === animation.value
                          ? 'bg-rose-600 text-white'
                          : 'bg-white hover:bg-rose-100'
                      }`}
                      onClick={() => handleAnimationClick(animation.value)}
                      disabled={isPlaying}
                    >
                      {animation.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Cách sử dụng:</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cách 1: Sử dụng CSS Classes</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {`<div className="animate__animated animate__fadeInUp">
  Nội dung với hiệu ứng fade in từ dưới lên
</div>`}
            </pre>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Cách 2: Sử dụng JS Function</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {`import { animateElement, AnimationTypes } from '@/utils/animation';

// Trong component:
const handleClick = () => {
  const element = document.getElementById('my-element');
  animateElement(element, AnimationTypes.BOUNCE);
};`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Thêm Delay và Duration</h3>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
              {`// Sử dụng CSS classes
<div className="animate__animated animate__fadeIn animate__delay-2s animate__slower">
  Nội dung xuất hiện sau 2s và chậm hơn
</div>

// Hoặc sử dụng JS
import { setAnimationDuration, setAnimationDelay } from '@/utils/animation';

setAnimationDuration('2s');
setAnimationDelay('1s');`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
} 