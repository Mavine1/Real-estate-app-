/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik-Regular", "sans-serif"],
        "rubik-bold": ["Rubik-Bold", "sans-serif"],
        "rubik-extrabold": ["Rubik-ExtraBold", "sans-serif"],
        "rubik-medium": ["Rubik-Medium", "sans-serif"],
        "rubik-semibold": ["Rubik-SemiBold", "sans-serif"],
        "rubik-light": ["Rubik-Light", "sans-serif"],
      },
      colors: {
        primary: {
          100: "#EEF4FF",
          200: "#D8E5FF",
          300: "#2F6BFF",
        },
        accent: {
          100: "#F4F7FF",
        },
        black: {
          DEFAULT: "#000000",
          100: "#98A2B3",
          200: "#667085",
          300: "#17213C",
        },
        danger: "#F75555",
      },
    },
  },
  plugins: [],
};
