import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#002855",
          light: "#003c80",
          dark: "#001a38",
        },
        accent: {
          DEFAULT: "#EAAA00",
          light: "#ffcc33",
          dark: "#b38200",
        },
        surface: {
          DEFAULT: "#F8F9FA",
          dark: "#0a1929",
        },
        "card-bg": "#112240",
      },
      fontFamily: {
        main: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        "gold-glow":
          "0 10px 40px -10px rgba(234, 170, 0, 0.2), 0 0 15px -3px rgba(234, 170, 0, 0.1)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "subtle-pulse": "subtlePulse 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeInUp: {
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        subtlePulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.9" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
