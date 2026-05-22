/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        darkVoid: "#050510",
        neonCyan: "#00f3ff",
        hotPink: "#ff00ea",
        toxicGreen: "#39ff14",
      },
      fontFamily: {
        orbitron: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        "neon-cyan":
          '0 0 5px theme("colors.neonCyan"), 0 0 20px theme("colors.neonCyan")',
        "neon-pink":
          '0 0 5px theme("colors.hotPink"), 0 0 20px theme("colors.hotPink")',
        "neon-green":
          '0 0 5px theme("colors.toxicGreen"), 0 0 20px theme("colors.toxicGreen")',
      },
    },
  },
  plugins: [],
};
