/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#081b2e',
          900: '#0d2238',
          800: '#102a43',
          700: '#173a5d',
          600: '#1f4d73',
        },
        medical: {
          blue: '#1d9bf0',
          cyan: '#5eead4',
          teal: '#14b8a6',
          red: '#ef4444',
          amber: '#f59e0b',
          green: '#22c55e',
          slate: '#e2e8f0',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.12)',
        glow: '0 10px 40px rgba(29, 155, 240, 0.18)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
