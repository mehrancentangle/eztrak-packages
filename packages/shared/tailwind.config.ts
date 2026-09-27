import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        MPlus1: ["M PLUS 1", "sans-serif"],
      },
      colors: {
        primary:"#FF7335",
        secondary:"#BBBBBB",
        primaryText:"#212529",
      },
    },
 
  },

  plugins: [],
};

export default config;


