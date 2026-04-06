/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        verde: '#1DB954',
        'verde-oscuro': '#158a3e',
        'verde-glow': '#1DB95420',
        fondo: '#0d1117',
        superficie: '#161b22',
        'superficie-2': '#21262d',
        borde: '#30363d',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}