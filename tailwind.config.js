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