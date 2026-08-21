/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7ccbfb',
          400: '#36b3f8',
          500: '#0c98e6',
          600: '#0078c7',
          700: '#0160a1',
          800: '#065184',
          900: '#0b446e',
        },
        surface: {
          DEFAULT: '#f5f7fb',
          card: '#ffffff',
          hover: '#eef2f9',
        },
      },
      boxShadow: {
        soft: '8px 8px 16px #d1d9e6, -8px -8px 16px #ffffff',
        'soft-sm': '4px 4px 8px #d1d9e6, -4px -4px 8px #ffffff',
        'soft-inset': 'inset 4px 4px 8px #d1d9e6, inset -4px -4px 8px #ffffff',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        glass: '12px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
