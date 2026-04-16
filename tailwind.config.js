/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0F172A",
        navy: "#1E293B",
        gold: "#D4A44D",
        ivory: "#F8FAFC",
      },
    },
  },
  plugins: [],
}