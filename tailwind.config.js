/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnight: "#0A1224",
        darkpanel: "#111F38",
        secnavy: "#192B49",
        eteal: "#14B8A6",
        softmint: "#B8FFF0",
        amber: "#F59E0B",
        coral: "#EF4444"
      },
      borderRadius: { 'xl': '12px' }
    }
  },
  plugins: []
}
