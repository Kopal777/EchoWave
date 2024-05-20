/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: {
        DEFAULT: {
          track: 'bg-gray-200',
          thumb: 'bg-gray-400',
          hover: {
            thumb: 'bg-gray-500',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}