import type { Config } from 'tailwindcss';
import animatePlugin from 'tailwindcss-animate';

const config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    '*.{js,ts,jsx,tsx,mdx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        // Custom brand colors
        brand: {
          purple: {
            DEFAULT: 'hsl(var(--brand-purple))',
            light: 'hsl(var(--brand-purple-light))',
            dark: 'hsl(var(--brand-purple-dark))'
          },
          blue: {
            DEFAULT: 'hsl(var(--brand-blue))',
            light: 'hsl(var(--brand-blue-light))',
            dark: 'hsl(var(--brand-blue-dark))'
          },
          green: {
            DEFAULT: 'hsl(var(--brand-green))',
            light: 'hsl(var(--brand-green-light))',
            dark: 'hsl(var(--brand-green-dark))'
          },
          yellow: {
            DEFAULT: 'hsl(var(--brand-yellow))',
            light: 'hsl(var(--brand-yellow-light))',
            dark: 'hsl(var(--brand-yellow-dark))'
          },
          orange: {
            DEFAULT: 'hsl(var(--brand-orange))',
            light: 'hsl(var(--brand-orange-light))',
            dark: 'hsl(var(--brand-orange-dark))'
          },
          red: {
            DEFAULT: 'hsl(var(--brand-red))',
            light: 'hsl(var(--brand-red-light))',
            dark: 'hsl(var(--brand-red-dark))'
          }
        },
        // Difficulty colors
        difficulty: {
          easy: 'hsl(var(--difficulty-easy))',
          medium: 'hsl(var(--difficulty-medium))',
          hard: 'hsl(var(--difficulty-hard))'
        },
        // Status colors
        status: {
          active: 'hsl(var(--status-active))',
          pending: 'hsl(var(--status-pending))',
          rejected: 'hsl(var(--status-rejected))',
          banned: 'hsl(var(--status-banned))',
          hold: 'hsl(var(--status-hold))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        gradient: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' }
        },
        shimmer: {
          '0%': { 'background-position': '-200% 0' },
          '100%': { 'background-position': '200% 0' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' }
        },
        pulse: {
          '0%, 100%': { boxShadow: '0 0 20px 5px rgba(255,0,80,0.5)' },
          '50%': { boxShadow: '0 0 30px 10px rgba(255,0,80,0.8)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 4px rgba(34,197,94,0.3)' },
          '50%': { boxShadow: '0 0 0 8px rgba(34,197,94,0.6)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        gradient: 'gradient 3s ease infinite',
        shimmer: 'shimmer 2s infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        pulse: 'pulse 2s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2s ease-in-out infinite',
        bounce: 'bounce 2s infinite'
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-success': 'var(--gradient-success)',
        'gradient-warning': 'var(--gradient-warning)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem'
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100'
      }
    }
  },
  plugins: [animatePlugin]
} satisfies Config;

export default config;
