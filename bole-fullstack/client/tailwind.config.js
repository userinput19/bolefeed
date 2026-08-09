/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#111317', // Very dark slate/charcoal
          900: '#1E2127', // Rich charcoal grey
          800: '#2D313A', // Dark grey
          700: '#404552', // Medium dark grey
          600: '#5A6172', // Slate grey
          500: '#788296', // Medium slate
          400: '#9FB0C7', // Light slate
          100: '#E4E9F2', // Very light grey/blue
          50:  '#F1F5F9', // Off-white cool grey
        },
        gold: {
          900: '#8A6508',
          700: '#D49B0C',
          500: '#F5B014',
          300: '#F9D16B',
          100: '#FEF6DF',
        },
        cream: '#F4F5F7',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
