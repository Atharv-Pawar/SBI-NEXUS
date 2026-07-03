/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sbi: {
          blue: '#003366',
          light: '#00a4e4',
          dark: '#002244',
          accent: '#20c997',
          hover: '#0084c4'
        }
      }
    },
  },
  plugins: [],
}
