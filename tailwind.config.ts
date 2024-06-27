/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // "primary": "#0b141b",
        "primary": "#354087",
        "secondary": "#04d370",
        // "secondary": "#21c063",
        "darkPrimary": "#2b346e",
        "tertiary" : "#fed81d",
        "footerbg" : "#262643",
      },
      fontFamily: {
        "sans": ["Inter", "sans-serif"],
        "poppins": ["Poppins", "sans-serif"],
        
      },
    },
  },
  plugins: [],
};
