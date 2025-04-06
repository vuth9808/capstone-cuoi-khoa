/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Light mode colors
        primary: {
          DEFAULT: '#FF385C', // accent color
          hover: '#E31C5F',
          light: '#FF6B81',
        },
        text: {
          primary: '#222222',
          secondary: '#717171',
        },
        bg: {
          primary: '#FFFFFF',
          secondary: '#F7F7F7',
        },
        border: '#DDDDDD',
        btn: {
          primary: '#FF385C',
          secondary: '#222222',
        },
        success: '#008A05',
        warning: '#C13515',
        
        // Dark mode specific colors are handled through the 'dark:' variant in classes
        // The 'airbnb' palette is kept for backward compatibility
        airbnb: {
          rosa: '#FF5A5F',     // Airbnb Red - Màu chính
          rausch: '#E31C5F',   // Đỏ đậm - Màu CTA
          arches: '#FD5C63',   // Cam đất nhạt 
          babu: '#00A699',     // Xanh nhạt
          kazan: '#007A87',    // Xanh đậm hơn
          hof: '#2B3A42',      // Xanh đậm tối
          foggy: '#F2F2F2',    // Xám nhạt - Màu nền
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
} 