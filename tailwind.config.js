/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables dark mode via a class
  theme: {
    extend: {
      screens: {
        xs: "300px", // Custom breakpoint for screens larger than 400px
      },
      backgroundImage: {
        'golden': 'var(--golden)',
      },
      textColor: {
        'golden': 'var(--golden)',
      },
      fontFamily:{
        cairo: ['Cairo', 'sans-serif']
      }
    },
  },
  plugins: [],
}
