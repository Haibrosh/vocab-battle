/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          dark: 'rgb(var(--primary-dark) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          dark: 'rgb(var(--secondary-dark) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
          dark: 'rgb(var(--muted-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          dark: 'rgb(var(--accent-dark) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
          dark: 'rgb(var(--destructive-dark) / <alpha-value>)',
        },
        success: {
          DEFAULT: 'rgb(var(--success) / <alpha-value>)',
          foreground: 'rgb(var(--success-foreground) / <alpha-value>)',
          dark: 'rgb(var(--success-dark) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          dark: 'rgb(var(--border-dark) / <alpha-value>)',
        },
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      borderRadius: {
        duo: '16px',
        'duo-lg': '20px',
        'duo-pill': '9999px',
      },
      boxShadow: {
        duo: '0 4px 0 0 rgb(var(--border-dark))',
        'duo-sm': '0 2px 0 0 rgb(var(--border-dark))',
        'duo-primary': '0 4px 0 0 rgb(var(--primary-dark))',
        'duo-secondary': '0 4px 0 0 rgb(var(--secondary-dark))',
        'duo-destructive': '0 4px 0 0 rgb(var(--destructive-dark))',
        'duo-success': '0 4px 0 0 rgb(var(--success-dark))',
      },
      keyframes: {
        'score-float': {
          '0%': { opacity: '1', transform: 'translateX(-50%) translateY(0) scale(1)' },
          '60%': { opacity: '1', transform: 'translateX(-50%) translateY(-18px) scale(1.3)' },
          '100%': { opacity: '0', transform: 'translateX(-50%) translateY(-28px) scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        'rocket-flame': {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1)', opacity: '0.85' },
          '50%': { transform: 'scaleY(1.35) scaleX(1.15)', opacity: '1' },
        },
        'rocket-boost': {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35) translateY(-4px)' },
          '100%': { transform: 'scale(1)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'score-float': 'score-float 1.2s ease-out forwards',
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'rocket-flame': 'rocket-flame 0.35s ease-in-out infinite',
        'rocket-boost': 'rocket-boost 0.6s ease-out',
        'bounce-slow': 'bounce-slow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
