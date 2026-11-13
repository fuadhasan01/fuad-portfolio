/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#FBFBFA',
          dark: '#09090E'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111118'
        },
        secondary: {
          light: '#F4F2EE',
          dark: '#1A1A24'
        },
        primary: {
          DEFAULT: '#111116',
          dark: '#F0EDE8'
        },
        muted: {
          DEFAULT: '#5E5E6E',
          dark: '#8A8A9A'
        },
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
          dark: '#C8F73E', // Reference signature electric chartreuse
          'dark-hover': '#D6FA5E'
        },
        border: {
          DEFAULT: 'rgba(17, 17, 22, 0.08)',
          dark: 'rgba(240, 237, 232, 0.08)'
        }
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      maxWidth: {
        'prose-article': '760px'
      }
    }
  },
  plugins: []
};


