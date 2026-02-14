import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          50: '#FFF8F0',
          100: '#FFEFD6',
          200: '#FFDEAD',
          300: '#FFCC80',
          400: '#FFB74D',
          500: '#F5A623',
          600: '#E8961E',
          700: '#C77A15',
          800: '#9E5E0D',
          900: '#7A4709',
        },
        cream: {
          50: '#FFFDF8',
          100: '#FFF9ED',
          200: '#FFF3DC',
          300: '#FFEBC4',
          400: '#FFE0A8',
          500: '#F5D89A',
        },
        gold: {
          50: '#FFF9E6',
          100: '#FFF0BF',
          200: '#FFE699',
          300: '#FFDB70',
          400: '#FFD04D',
          500: '#D4A843',
          600: '#B8923A',
        },
        earth: {
          50: '#FAF5F0',
          100: '#F0E6D8',
          200: '#E0D0BC',
          300: '#C4A882',
          400: '#A8876A',
          500: '#8B6F55',
          600: '#6E5740',
          700: '#5A4733',
          800: '#3D2F20',
          900: '#2A1F15',
        },
        sage: {
          50: '#F5F7F2',
          100: '#E8EDE2',
          200: '#D3DCCA',
          300: '#B5C4A5',
          400: '#96AC82',
          500: '#7A9466',
          600: '#5E764D',
        },
        warm: {
          white: '#FFFDF8',
          offwhite: '#FAF5ED',
          paper: '#F5EDE0',
          linen: '#EDE4D4',
          muted: '#C4B5A0',
          text: '#3D2F20',
          'text-light': '#6E5740',
          'text-muted': '#A8956F',
        },
        rose: {
          warm: '#D4756B',
          soft: '#E8A89E',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'ken-burns': 'kenburns 20s ease-in-out infinite alternate',
        'fade-in': 'fadein 0.6s ease-out',
        'slide-up': 'slideup 0.5s ease-out',
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translate(0, 0)' },
          '100%': { transform: 'scale(1.15) translate(-2%, -1%)' },
        },
        fadein: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideup: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
