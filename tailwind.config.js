/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'identity': '#00205b',
        'base': '#e1e2e1',
        'action': '#00bcd4',
        'neutral-dark': '#111827',
        'neutral-main': '#6B7280',
        'neutral-light': '#A7A9AC',
        'neutral-white' : '#FDFFFF',
      },
      fontFamily: {
        saira: ['Saira', 'sans-serif'],
        faustina: ['Faustina', 'serif'],
      },
    },
  },
  plugins: [],
}

