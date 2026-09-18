/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kenya: {
          red: '#c02621',
          green: '#006600',
          dark: '#0a0e14',
          panel: '#121820',
          card: '#18202c',
          border: '#263445',
          gold: '#e5a93c',
          accent: '#10b981',
          crimson: '#e11d48'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'Menlo', 'monospace'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
