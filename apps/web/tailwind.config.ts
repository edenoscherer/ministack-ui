import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './providers/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          soft: 'var(--primary-soft)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
          soft: 'var(--destructive-soft)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
          soft: 'var(--warning-soft)',
        },
        info: {
          DEFAULT: 'var(--info)',
          soft: 'var(--info-soft)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          border: 'var(--sidebar-border)',
        },
        terminal: {
          DEFAULT: 'var(--terminal)',
          foreground: 'var(--terminal-foreground)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        card: '0 4px 6px -1px rgb(0 0 0 / 0.03), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
        elevated: '0 10px 25px -5px rgb(15 23 42 / 0.08), 0 4px 10px -4px rgb(15 23 42 / 0.04)',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(1.4)' },
        },
        heartbeat: {
          '0%, 100%': { boxShadow: '0 0 0 0 oklch(0.72 0.17 162 / 0.5)' },
          '50%': { boxShadow: '0 0 0 8px oklch(0.72 0.17 162 / 0)' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        heartbeat: 'heartbeat 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
