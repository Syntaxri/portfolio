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
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
        xs: ['0.6875rem', { lineHeight: '1rem' }],
        sm: ['0.8125rem', { lineHeight: '1.25rem' }],
        base: ['0.9375rem', { lineHeight: '1.5rem' }],
        lg: ['1.0625rem', { lineHeight: '1.5rem' }],
        xl: ['1.25rem', { lineHeight: '1.5rem' }],
        '2xl': ['1.5rem', { lineHeight: '1.375' }],
        '3xl': ['1.875rem', { lineHeight: '1.2' }],
        '4xl': ['2.25rem', { lineHeight: '1.1' }],
        '5xl': ['3rem', { lineHeight: '1.05' }],
      },
      colors: {
        accent: 'var(--accent)',
        surface: 'var(--surface)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
      },
      animation: {
        'aurora-drift': 'aurora-drift 20s ease-in-out infinite',
        'aurora-float': 'aurora-float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'status-pulse': 'status-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in': 'fade-in 0.3s ease forwards',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards',
      },
    },
  },
  plugins: [],
}
