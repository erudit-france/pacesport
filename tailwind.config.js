/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          '50':  '#fbfaf4',
          '100': '#f9f0c0',
          '200': '#f1dd85',
          '300': '#ddb852',
          '400': '#c08d2c',
          '500': '#a16d16',
          '600': '#83540e',
          '700': '#643f0d',
          '800': '#442b0b',
          '900': '#2d1a08',
        },
      }
    },
  },
  plugins: [],
}
