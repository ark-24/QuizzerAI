/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ubuntu: 'ubuntu, Times New Roman, serif',
        lato: 'lato, Times New Roman, serif',
        
    },
    },
  },
  plugins: [],
}

