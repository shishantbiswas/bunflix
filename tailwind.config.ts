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
        jumpForward: {
          "0%, 100%": { opacity: "0", transform: "translateX(0)" },
          "50%": { opacity: "1", transform: "translateX(50px)" },
        },
        jumpBackward: {
          "0%, 100%": { opacity: "0", transform: "translateX(0)" },
          "50%": { opacity: "1", transform: "translateX(-50px)" },
        },
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
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "jump-forward": "jumpForward 1s ease-in-out",
        "jump-backward": "jumpBackward 1s ease-in-out",
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
