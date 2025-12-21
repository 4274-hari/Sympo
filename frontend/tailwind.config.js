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
        
      },
    },
  },
  plugins: [],
};
