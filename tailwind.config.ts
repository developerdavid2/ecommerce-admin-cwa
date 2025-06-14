/** @type {import('tailwindcss').Config} */
//const colors = require("tailwindcss/colors");
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1536px",
      },
    },
    extend: {
      fontFamily: {
        sans: [
          "var(--font-inter-var)",
          {
            fontFeatureSettings: "ss03",
            fontVariationSettings: "normal",
          },
        ],
        geist: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
    },
  },
  plugins: [],
};
