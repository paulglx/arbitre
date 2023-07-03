/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
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
      'sans': ['Inter', '"Helvetica Neue"', 'apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'ui-sans-serif'],
      'mono': ['"JetBrains Mono"', 'ui-monospace'],
    }
  }, 
  plugins: [],
}