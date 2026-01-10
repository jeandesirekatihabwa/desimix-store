/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
        "2xl": "3rem",
      },
    },
    extend: {
      colors: {
        bg: "#0b0b0d",
        card: "#141417",
        primary: "#f97316",
        muted: "#9ca3af",

        // Professional supporting tokens (new)
        border: "rgba(255,255,255,0.10)",
        soft: "rgba(255,255,255,0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
        card: "0 18px 50px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(249,115,22,0.25), 0 20px 60px rgba(249,115,22,0.08)",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "Inter", "Segoe UI", "Roboto", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
