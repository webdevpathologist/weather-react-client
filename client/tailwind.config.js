/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        prompt: ["Prompt", "sans-serif"],
      },
    },
  },
  plugins: [
    // require("@shrutibalasa/tailwind-grid-auto-fit")
  ],
};
