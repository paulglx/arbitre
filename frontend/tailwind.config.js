/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      "colors": {
        "blue": {
          50: "#F0F7FF",
          100: "#DBEDFF",
          200: "#ADD5FF",
          300: "#85C0FF",
          400: "#5CABFF",
          500: "#3396FF",
          600: "#057EFF",
          700: "#006ADB",
          800: "#0056B3",
          900: "#00438A",
          950: "#003773"
        },
        gray: colors.zinc,
      }
    },
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        "2xl": '7rem'
      },
    },
    fontFamily: {
      'sans': ['Inter', ...defaultTheme.fontFamily.sans],
      'mono': ['"JetBrains Mono"', 'ui-monospace'],
    }
  }, 
  plugins: [],
}