/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        navy: { DEFAULT: '#0F2138', light: '#16304F', dark: '#0A1728' },
        parchment: { DEFAULT: '#FAF7EF', dim: '#F1ECDD' },
        gold: { DEFAULT: '#C9A227', light: '#E4C55E', dark: '#9C7D1B' },
        teal: { DEFAULT: '#1E8A73', light: '#37A78E' },
        coral: { DEFAULT: '#C3524A' },
        ink: '#1A2233',
        slate2: '#2F4C7A',
      },
    },
  },
  plugins: [],
};
