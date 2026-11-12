/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F9F9F7',
          warm: '#F2F1EC',
          rule: '#D6D5CE',
        },
        rail: {
          DEFAULT: '#14161A',
          elevated: '#1F242D',
          border: '#2A2E37',
          muted: '#9CA3AF',
        },
        signal: {
          red: '#D92B2B',
          redHover: '#B91C1C',
          cobalt: '#1D4ED8',
          cobaltTint: '#EFF6FF',
        },
        stone: {
          50: '#F9F9F7',
          100: '#F2F1EC',
          200: '#E4E2DA',
          300: '#D6D5CE',
        },
        ink: {
          900: '#14161A',
          800: '#1F242D',
          600: '#4B5563',
        },
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Chivo Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
