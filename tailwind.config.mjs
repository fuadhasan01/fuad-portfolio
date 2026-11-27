/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8F9FA',
          dark: '#0C0D12'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#151720'
        },
        secondary: {
          light: '#F0F0EE',
          dark: '#1D202B'
        },
        primary: {
          DEFAULT: '#111217',
          dark: '#F4F3EF'
        },
        muted: {
          DEFAULT: '#5A5D6B',
          dark: '#9496A1'
        },
        accent: {
          DEFAULT: '#D97706', // Technical Amber (Light)
          hover: '#B45309',
          dark: '#F59E0B',     // Technical Phosphor Amber (Dark)
          'dark-hover': '#D97706'
        },
        border: {
          DEFAULT: 'rgba(17, 18, 23, 0.08)',
          dark: 'rgba(244, 243, 239, 0.10)'
        }
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '8px',
        xl: '10px'
      },
      maxWidth: {
        'prose-article': '760px'
      }
    }
  },
  plugins: []
};
