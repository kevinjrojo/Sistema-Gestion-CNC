import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  "#f0f4ff",
          100: "#dce6f9",
          200: "#b8cef4",
          500: "#2d4a7a",
          700: "#1a2f5a",
          900: "#0f1d3a",
          950: "#0a1428",
        },
        brand: {
          400: "#5fa8f5",
          500: "#4a90e2",
          600: "#3578c8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
