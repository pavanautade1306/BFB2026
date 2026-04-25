/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2d6a1f",
          light: "#4a9e2e",
          pale: "#eaf3de",
        },
        accent: {
          DEFAULT: "#e8a020",
          pale: "#faeeda",
        },
        soil: "#6b4226",
        surface: {
          DEFAULT: "#ffffff",
          alt: "#f7faf4",
        },
        textDark: "#1a2e14",
        textMuted: "#5a6e52",
      },
      fontFamily: {
        heading: ["'Plus Jakarta Sans'", "sans-serif"],
        body: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
