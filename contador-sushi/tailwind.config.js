/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1a1a',
        salmon: '#ff6b4a',
        'salmon-deep': '#e84f2f',
        nori: '#1f4d3a',
        'nori-light': '#2d6b52',
        rice: '#fff8f0',
        washi: '#f4ebe0',
        mist: '#e8ddd0',
        gold: '#e8a838',
      },
      fontFamily: {
        display: ['"Mochiy Pop One"', 'system-ui', 'sans-serif'],
        body: ['Nunito', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px rgba(26, 26, 26, 0.12)',
        lift: '0 8px 24px rgba(255, 107, 74, 0.28)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'menu-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'eat-bounce': {
          '0%, 100%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.12)' },
          '70%': { transform: 'scale(0.96)' },
        },
        celebrate: {
          '0%': { transform: 'scale(0.6) rotate(-8deg)', opacity: '0' },
          '60%': { transform: 'scale(1.08) rotate(4deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0' },
        },
        blink: {
          '0%, 92%, 100%': { transform: 'scaleY(1)' },
          '96%': { transform: 'scaleY(0.08)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
        'winner-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(232, 168, 56, 0.35)' },
          '50%': { boxShadow: '0 0 0 12px rgba(232, 168, 56, 0)' },
        },
      },
      animation: {
        float: 'float 3.2s ease-in-out infinite',
        'menu-in': 'menu-in 0.55s ease-out both',
        'eat-bounce': 'eat-bounce 0.45s ease-out',
        celebrate: 'celebrate 0.7s ease-out both',
        confetti: 'confetti 2.8s linear forwards',
        blink: 'blink 3.2s ease-in-out infinite',
        wiggle: 'wiggle 2s ease-in-out infinite',
        'winner-glow': 'winner-glow 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
