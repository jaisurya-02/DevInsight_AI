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
          dark: '#070B14',
          surface: '#0D1320',
          elevated: '#111827',
          card: '#161F32',
        },
        border: {
          dark: '#1F2937',
          subtle: '#2B3548',
          hover: '#374151',
        },
        primary: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
          light: '#818CF8',
          muted: 'rgba(99, 102, 241, 0.15)',
        },
        secondary: {
          DEFAULT: '#22D3EE',
          muted: 'rgba(34, 211, 238, 0.15)',
        },
        accent: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#A855F7',
        },
        txt: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
