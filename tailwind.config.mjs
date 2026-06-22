/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/lib/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['DM Mono', 'monospace'],
        display: ['Syne', 'sans-serif'],
        body: ['DM Mono', 'monospace'],
      },
      colors: {
        accent: 'var(--accent)',
        surface: 'var(--surface)',
        base: {
          DEFAULT: '#0a0a0f',
          50: '#12121a',
          100: '#1a1a26',
          200: '#222233',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards',
        'spin-slow': 'spin 0.7s linear infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.5)' },
        },
      },
    },
  },
  plugins: [],
};
