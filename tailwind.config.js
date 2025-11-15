/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0056e0',
          600: '#0043ad',
          700: '#00307a',
          800: '#001d47',
          900: '#000a14',
        },
        secondary: {
          50: '#e6fff9',
          100: '#b3ffec',
          200: '#80ffdf',
          300: '#4dffd2',
          400: '#1affc5',
          500: '#00e6ac',
          600: '#00b386',
          700: '#008060',
          800: '#004d3a',
          900: '#001a14',
        },
      },
    },
  },
  plugins: [],
}
