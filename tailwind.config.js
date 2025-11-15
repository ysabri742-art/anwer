/** @type {import('tailwindcss').Config} */
export default {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
      },
      colors: {
        primary: '#4338CA',
        accent: '#F59E0B',
      }
    },
  },
  plugins: [],
}