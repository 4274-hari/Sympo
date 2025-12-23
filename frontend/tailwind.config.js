/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
        "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rome': ['Times New Roman', 'ui-sans-serif', 'system-ui'],
        georama: ['Georama', 'sans-serif'],
      },
      animation: {
        lightFlow: "lightFlow 3s linear infinite",
      },
      backgroundSize: {
        "200": "200% 200%",
      },
    },
  },
  plugins: [],
};
