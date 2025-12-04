/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode removed in favor of CSS variant
  theme: {
    extend: {
      colors: {
        neutral: {
          950: '#0a0a0a', // Deep Black
          400: '#a3a3a3', // Gray/Silver
        },
        emerald: {
          500: '#10b981', // Brand Green
          700: '#047857', // Jade / Forest Green (Darker Accent)
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
