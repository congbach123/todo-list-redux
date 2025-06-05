/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Custom brand colors
        'dark-gray': '#e3e8e8',
        'light-gray': '#f5f6f6',
        'text-main': '#495057',
        'text-secondary': '#6c757d',
      },
    },
  },
  plugins: [],
};
