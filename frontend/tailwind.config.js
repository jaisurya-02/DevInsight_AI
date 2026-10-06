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
          dark: '#F8FAFC',       // Main page background (Slate 50)
          surface: '#FFFFFF',    // Main card / container background (Pure White)
          elevated: '#F1F5F9',   // Hover state / secondary container (Slate 100)
          card: '#FFFFFF',       // Card panels
          inverse: '#0F172A',    // Dark inverse container when needed
        },
        border: {
          dark: '#E2E8F0',       // Main structural border (Slate 200)
          subtle: '#CBD5E1',     // Accent border (Slate 300)
          hover: '#94A3B8',      // Hover border (Slate 400)
        },
        primary: {
          DEFAULT: '#4F46E5',    // Deep Royal Indigo
          hover: '#4338CA',
          light: '#6366F1',
          muted: 'rgba(79, 70, 229, 0.08)',
        },
        secondary: {
          DEFAULT: '#0284C7',    // Sky Cobalt
          muted: 'rgba(2, 132, 199, 0.08)',
        },
        accent: {
          success: '#059669',    // Emerald Green
          warning: '#D97706',    // Warm Amber
          danger: '#DC2626',     // Crimson Red
          purple: '#7C3AED',     // Deep Violet
        },
        txt: {
          primary: '#0F172A',    // Main text (Slate 900)
          secondary: '#475569',  // Subtext (Slate 600)
          muted: '#64748B',      // Muted caption (Slate 500)
          inverse: '#F8FAFC',    // Text on dark surfaces
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
