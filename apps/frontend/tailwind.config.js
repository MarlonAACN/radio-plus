/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['DMSans', 'sans-serif'],
      serif: ['Arizonia', 'serif'],
    },
    extend: {
      screens: {
        mini: '350px',
        xs: '450px',
      },
      fontFamily: {
        dmsans: ['DMSans', 'sans-serif'],
        arizonia: ['Arizonia', 'serif'],
      },
      colors: {
        primary: {
          400: '#f13d67',
          500: '#F70062',
          600: '#cd2e8b',
          700: '#93489d',
          800: '#595396',
        },
        secondary: {
          700: '#31517b',
          800: '#31517b',
        },
        spotify: {
          500: '#1ED760',
        },
        base: {
          0: '#FFFFFF',
          500: '#A7A7A7',
          600: '#5A5A5A',
          700: '#242424',
          800: '#121212',
          900: '#000',
        },
        font: {
          0: '#FFFFFF',
          300: '#a7a7a7',
          400: '#a7a7a7',
        },
      },
      boxShadow: {
        simple: '0px 2px 8px 0px rgba(99, 99, 99, 0.2)',
        bottom: '0px 10px 4px -8px rgba(99, 99, 99, 0.1)',
      },
      maxWidth: {
        banner: '1600px',
      },
      padding: {
        ['main-small']: '1.25rem',
        ['main-medium']: '2.5rem',
        ['main-large']: '4rem',
      },
    },
  },
  plugins: [],
};
