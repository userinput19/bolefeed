/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          950: '#0a2016',
          900: '#1B4D2E',
          800: '#245f38',
          700: '#2D7A47',
          600: '#3a9458',
          500: '#4CAF50',
          400: '#6ec96f',
          100: '#e8f5e9',
          50:  '#f1faf1',
        },
        gold: {
          900: '#7a5500',
          700: '#C8920A',
          500: '#F0B429',
          300: '#f7d070',
          100: '#fef9e7',
        },
        cream: '#F8F4E8',
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
