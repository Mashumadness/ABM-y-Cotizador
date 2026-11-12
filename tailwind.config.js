/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f7',
          100: '#fbe8f0',
          200: '#f7d3e2',
          300: '#f0b0cb',
          400: '#e482ab',
          500: '#d75d8d',
          600: '#c23e71',
          700: '#a52d59',
          800: '#89274a',
          900: '#732541',
        }
      }
    },
  },
  plugins: [],
}
