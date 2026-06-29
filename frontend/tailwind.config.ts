import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FAFAFA",
        surface: {
          glass: "rgba(255, 255, 255, 0.4)",
          clay: "#FDFBF7",
        },
        text: {
          heading: "#1A1A1A",
          body: "#4A4A4A",
        },
        mirra: {
          pink: "#FFD1DC",
          mint: "#A8E6CF",
          lavender: "#E8C4FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "sans-serif"],
        serif: ["var(--font-instrument-serif)", "serif"],
        syncopate: ["var(--font-syncopate)", "sans-serif"],
        delta: ["var(--font-dela-gothic-one)", "sans-serif"],
      },
      boxShadow: {
        'clay-sm': '3px 3px 6px rgba(209,225,255,0.2), -3px -3px 6px rgba(255,255,255,0.9)',
        'clay-md': '8px 8px 20px rgba(209,225,255,0.35), -8px -8px 20px rgba(255,255,255,1)',
        'clay-lg': '16px 16px 36px rgba(209,225,255,0.45), -16px -16px 36px rgba(255,255,255,1)',
        'clay-pink': '8px 8px 20px rgba(255,209,220,0.4), -8px -8px 20px rgba(255,255,255,1)',
        'clay-mint': '8px 8px 20px rgba(168,230,207,0.4), -8px -8px 20px rgba(255,255,255,1)',
      },
    },
  },
  plugins: [],
};
export default config;
