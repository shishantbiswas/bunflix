import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      keyframes: {
        timer: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        loading: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        timer: "timer 1s ease-out",
        loading: "loading 1.5s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-motion"),
    require("tailwindcss-animate"),
    require("tailwind-scrollbar-hide"),
    require('tailwindcss-intersect')
  ],
} satisfies Config;

export default config;
