/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#0D0D0D',
        card: '#1A1A1A',
        border: '#2A2A2A',
        gold: '#D4AF37',
        goldSoft: '#B8952E',
        success: '#66BB6A',
        warning: '#FF9800',
        info: '#42A5F5',
        purple: '#AB47BC',
        muted: '#8A8A85',
        text: '#F5F5F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
