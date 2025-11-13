import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Primary Colors
        primary: {
          black: '#000000',
        },
        // Neutral Colors
        neutral: {
          white: '#FFFFFF',
          background: '#F8F7F4',
          offWhite: '#FAFAFA',
          lightGray: '#F5F5F5',
          gray100: '#E5E5E5',
          gray200: '#D4D4D4',
          gray300: '#A3A3A3',
          gray400: '#737373',
          gray500: '#525252',
          gray700: '#404040',
          gray900: '#171717',
        },
        // Accent Colors
        accent: {
          yellow: '#FFD700',
          yellowHover: '#FFC700',
        },
        // Semantic Colors
        semantic: {
          success: '#10B981',
          successLight: '#D1FAE5',
          warning: '#F59E0B',
          warningLight: '#FEF3C7',
          error: '#EF4444',
          errorLight: '#FEE2E2',
          info: '#3B82F6',
          infoLight: '#DBEAFE',
        },
        // Interactive Colors
        interactive: {
          link: '#3B82F6',
          linkHover: '#2563EB',
          linkVisited: '#7C3AED',
        },
        // shadcn/ui compatibility
        border: '#E5E5E5',
        input: '#F5F5F5',
        ring: '#000000',
        background: '#F8F7F4',
        foreground: '#171717',
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#737373',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717',
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: [
          'Poppins',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
          'Noto Color Emoji',
        ],
        mono: ['monospace'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      borderRadius: {
        lg: '1rem',
        md: '0.75rem',
        sm: '0.5rem',
      },
      boxShadow: {
        navbar: '0 1px 3px rgba(0, 0, 0, 0.1)',
        section: '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
