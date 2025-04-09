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
          primary: '#222222',    // Chữ chính trong light mode
          secondary: '#717171',  // Chữ phụ trong light mode
        },
        bg: {
          primary: '#FFFFFF',    // Nền chính trong light mode
          secondary: '#F7F7F7',  // Nền phụ trong light mode
        },
        border: '#DDDDDD',
        btn: {
          primary: '#FF385C',
          secondary: '#222222',
        },
        success: '#008A05',
        warning: '#C13515',
        
        // Dark mode specific colors 
        dark: {
          text: {
            primary: '#FFFFFF',     // Chữ chính trong dark mode
            secondary: '#B0B0B0',   // Chữ phụ trong dark mode
          },
          bg: {
            primary: '#1D1D1D',     // Nền chính trong dark mode
            secondary: '#2A2A2A',   // Nền phụ trong dark mode
            tertiary: '#383838',    // Nền cấp 3 trong dark mode
          },
          border: '#383838',        // Viền trong dark mode
        },
        
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