/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#080C14',
          surface: '#0F1522',
          elevated: '#161E30',
          card: '#1A2438',
        },
        border: {
          dark: '#243048',
          subtle: '#2D3C5A',
          hover: '#3E5075',
        },
        primary: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#34D399',
          muted: 'rgba(16, 185, 129, 0.12)',
        },
        secondary: {
          DEFAULT: '#3B82F6',
          muted: 'rgba(59, 130, 246, 0.12)',
        },
        accent: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#8B5CF6',
        },
        txt: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
