/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-cinzel)', 'serif'],
        sans: ['var(--font-lato)', 'sans-serif'],
      },
      colors: {
        'parchment': '#f5e5c7',
        'stone': {
          'light': '#4a5568',
          'DEFAULT': '#2d3748',
          'dark': '#1a202c',
        },
        'dragon-red': '#9b2c2c',
      },
    },
  },
  plugins: [],
}