/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#fc8019", // Swiggy-like orange
        secondary: "#282c3f", // Dark text
      }
    },
  },
  plugins: [],
}
