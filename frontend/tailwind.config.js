/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", 
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5A67D8",
        secondary: "#9F7AEA",
      },
    },
  },
  plugins: [],
};
