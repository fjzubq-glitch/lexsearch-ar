/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "azure": "#F0F7FF",
        "obsidian": "#050505",
        "primary": "#f2ca50",
        "on-surface": "#050505",
        "surface": "#F0F7FF",
      },
      fontFamily: {
        "serif": ["Noto Serif", "serif"],
        "sans": ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
}
