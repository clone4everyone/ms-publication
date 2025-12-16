/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        outlook: {
          blue: '#0078d4',
          lightBlue: '#deecf9',
          darkBlue: '#106ebe',
          gray: '#f3f2f1',
          darkGray: '#605e5c',
          border: '#edebe9'
        }
      }
    },
  },
  plugins: [],
}