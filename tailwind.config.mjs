/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/app/**/*.{ts,tsx,mdx}', './src/components/**/*.{ts,tsx}', './src/lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        'bg-2': 'rgb(var(--bg-2-rgb) / <alpha-value>)',
        surface: 'rgb(var(--surface-rgb) / <alpha-value>)',
        text: 'rgb(var(--text-rgb) / <alpha-value>)',
        'text-2': 'rgb(var(--text-2-rgb) / <alpha-value>)',
        'text-3': 'rgb(var(--text-3-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        gold: 'rgb(var(--gold-rgb) / <alpha-value>)',
        emerald: 'rgb(var(--emerald-rgb) / <alpha-value>)',
        terra: 'rgb(var(--terra-rgb) / <alpha-value>)',
        ivory: 'rgb(var(--ivory-rgb) / <alpha-value>)',
        walnut: 'rgb(var(--walnut-rgb) / <alpha-value>)',
        ok: 'rgb(var(--ok-rgb) / <alpha-value>)',
        err: 'rgb(var(--err-rgb) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        mono: ['var(--font-mono)'],
        serif: ['var(--font-serif)'],
        display: ['var(--font-sans)'],
      },
      boxShadow: {
        brass: '0 4px 26px rgba(140, 102, 52, 0.22)',
        azul: '0 4px 26px rgba(30, 64, 130, 0.2)',
        'arch-ink': '0 24px 60px -30px rgba(50, 40, 20, 0.5)',
      },
      maxWidth: {
        'prose-narrow': '52ch',
        'prose-wide': '68ch',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'in-out-expo': 'var(--ease-in-out-expo)',
      },
    },
  },
  plugins: [],
}