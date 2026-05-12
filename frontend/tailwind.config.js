/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        clay:  { DEFAULT: '#C8622A', light: '#E8916A', dark: '#A04E1E' },
        paper: { DEFAULT: '#F5F1EB', dark: '#EDE8DF' },
        ink:   { DEFAULT: '#1C1917', soft: '#292420' },
        smoke: '#E5DDD0',
        ash:   '#9C8B7A',
        cream: '#FDFAF6',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['Lora', 'serif'],
        ui:      ['"DM Sans"', 'sans-serif'],
        mono:    ['"Space Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
