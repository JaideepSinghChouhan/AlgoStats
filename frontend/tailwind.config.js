/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce8ff',
          400: '#6b9eff',
          500: '#4b7dff',
          600: '#3a6cf0',
          700: '#2b5de0',
          900: '#1a3abf',
        },
        dark: {
          900: '#0a0e1a',
          800: '#0f1528',
          700: '#141c36',
          600: '#1c2848',
          500: '#243058',
          400: '#2e3d6e',
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #4b7dff 0%, #a855f7 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0f1528 0%, #0a0e1a 100%)',
        'card-glow': 'linear-gradient(135deg, rgba(75,125,255,0.12) 0%, rgba(168,85,247,0.08) 100%)',
      },
      boxShadow: {
        'glow-brand': '0 0 30px rgba(75,125,255,0.25)',
        'glow-purple': '0 0 30px rgba(168,85,247,0.25)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
