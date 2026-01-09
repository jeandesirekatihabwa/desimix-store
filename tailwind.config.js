/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0b0b0d",
        card: "#141417",
        primary: "#f97316",
        muted: "#9ca3af",
      },
    },
  },
  plugins: [],
};
