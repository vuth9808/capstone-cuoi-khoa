/**
 * Tiện ích để làm việc với Animate.css
 * Dựa trên hướng dẫn từ: https://animate.style/
 */

const PREFIX = 'animate__';

/**
 * Thêm các lớp animation vào phần tử
 * @param element Element hoặc selector string
 * @param animation Tên animation (không cần prefix)
 * @param prefix Prefix mặc định là 'animate__'
 * @returns Promise sẽ resolve khi animation kết thúc
 */
export const animateElement = (
  element: HTMLElement | string, 
  animation: string, 
  prefix = PREFIX
): Promise<string> => {
  return new Promise((resolve) => {
    const node = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element;
    
    if (!node) {
      resolve('Element not found');
      return;
    }

    const animationName = `${prefix}${animation}`;
    
    node.classList.add(`${prefix}animated`, animationName);

    // Xử lý khi animation kết thúc
    const handleAnimationEnd = (event: AnimationEvent) => {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    };

    node.addEventListener('animationend', handleAnimationEnd as EventListener, { once: true });
  });
};

/**
 * Thiết lập thời lượng mặc định cho tất cả các animation
 * @param duration Thời gian (ví dụ: '0.5s', '300ms')
 */
export const setAnimationDuration = (duration: string): void => {
  document.documentElement.style.setProperty('--animate-duration', duration);
};

/**
 * Thiết lập độ trễ mặc định cho tất cả các animation
 * @param delay Thời gian trễ (ví dụ: '0.5s', '300ms')
 */
export const setAnimationDelay = (delay: string): void => {
  document.documentElement.style.setProperty('--animate-delay', delay);
};

/**
 * Thiết lập số lần lặp lại mặc định cho tất cả các animation
 * @param iterations Số lần lặp lại (ví dụ: '2', 'infinite')
 */
export const setAnimationIterations = (iterations: string): void => {
  document.documentElement.style.setProperty('--animate-repeat', iterations);
};

/**
 * Danh sách các animation có sẵn để sử dụng
 * Tham khảo tại: https://animate.style/
 */
export const AnimationTypes = {
  // Attention seekers
  BOUNCE: 'bounce',
  FLASH: 'flash',
  PULSE: 'pulse',
  RUBBER_BAND: 'rubberBand',
  SHAKE_X: 'shakeX',
  SHAKE_Y: 'shakeY',
  HEAD_SHAKE: 'headShake',
  SWING: 'swing',
  TADA: 'tada',
  WOBBLE: 'wobble',
  JELLO: 'jello',
  HEART_BEAT: 'heartBeat',
  
  // Back entrances
  BACK_IN_DOWN: 'backInDown',
  BACK_IN_LEFT: 'backInLeft',
  BACK_IN_RIGHT: 'backInRight',
  BACK_IN_UP: 'backInUp',
  
  // Back exits
  BACK_OUT_DOWN: 'backOutDown',
  BACK_OUT_LEFT: 'backOutLeft',
  BACK_OUT_RIGHT: 'backOutRight',
  BACK_OUT_UP: 'backOutUp',
  
  // Fading entrances
  FADE_IN: 'fadeIn',
  FADE_IN_DOWN: 'fadeInDown',
  FADE_IN_LEFT: 'fadeInLeft',
  FADE_IN_RIGHT: 'fadeInRight',
  FADE_IN_UP: 'fadeInUp',
  
  // Fading exits
  FADE_OUT: 'fadeOut',
  FADE_OUT_DOWN: 'fadeOutDown',
  FADE_OUT_LEFT: 'fadeOutLeft',
  FADE_OUT_RIGHT: 'fadeOutRight',
  FADE_OUT_UP: 'fadeOutUp',
  
  // Zooming entrances
  ZOOM_IN: 'zoomIn',
  ZOOM_IN_DOWN: 'zoomInDown',
  ZOOM_IN_LEFT: 'zoomInLeft',
  ZOOM_IN_RIGHT: 'zoomInRight',
  ZOOM_IN_UP: 'zoomInUp',
  
  // Zooming exits
  ZOOM_OUT: 'zoomOut',
  ZOOM_OUT_DOWN: 'zoomOutDown',
  ZOOM_OUT_LEFT: 'zoomOutLeft',
  ZOOM_OUT_RIGHT: 'zoomOutRight',
  ZOOM_OUT_UP: 'zoomOutUp',
  
  // Specials
  HINGE: 'hinge',
  JACK_IN_THE_BOX: 'jackInTheBox',
  ROLL_IN: 'rollIn',
  ROLL_OUT: 'rollOut',
} as const;

export type AnimationType = typeof AnimationTypes[keyof typeof AnimationTypes]; 