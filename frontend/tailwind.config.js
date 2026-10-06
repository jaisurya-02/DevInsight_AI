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
          dark: '#F6F8FA',       // Main page background (GitHub Light Slate)
          surface: '#FFFFFF',    // Main card / container background (Pure White)
          elevated: '#F3F4F6',   // Soft grey panel (Slate 100)
          card: '#FFFFFF',       // Card panels
          inverse: '#1F2328',    // Dark inverse container
        },
        border: {
          dark: '#D0D7DE',       // Structural border (Clean Slate)
          subtle: '#E5E7EB',     // Light divider
          hover: '#0969DA',      // Active border hover
        },
        primary: {
          DEFAULT: '#0969DA',    // Classic GitHub / Linear Royal Blue
          hover: '#0353B4',
          light: '#218BFF',
          muted: 'rgba(9, 105, 218, 0.08)',
        },
        secondary: {
          DEFAULT: '#0576B9',    // Deep Cobalt
          muted: 'rgba(5, 118, 185, 0.08)',
        },
        accent: {
          success: '#1F883D',    // Deep GitHub Emerald
          warning: '#9A6700',    // Warm Amber
          danger: '#CF222E',     // Crimson Red
          purple: '#8250DF',     // Deep Purple
        },
        txt: {
          primary: '#1F2328',    // Main dark text (100% visible)
          secondary: '#424A53',  // Subtext (100% visible)
          muted: '#656D76',      // Caption text
          inverse: '#FFFFFF',    // Text on dark buttons
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
