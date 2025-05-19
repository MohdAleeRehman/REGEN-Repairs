/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#333333',
        secondary: '#ffed4a',
        danger: '#e3342f',
        success: '#38c172',
      },
    },
  },
  plugins: [],
}