/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8F4E6',
          dark: '#202025',
          DEFAULT: 'var(--color-bg)'
        },
        surface: {
          light: '#F1EAD5',
          dark: '#28282E',
          DEFAULT: 'var(--color-bg-card)'
        },
        alt: {
          light: '#F1EAD5',
          dark: '#16161A',
          DEFAULT: 'var(--color-bg-alt)'
        },
        subtle: {
          light: '#ECE4CA',
          dark: '#1D1D22',
          DEFAULT: 'var(--color-bg-subtle)'
        },
        primary: {
          light: '#1D1D22',
          dark: '#FBFBFB',
          DEFAULT: 'var(--color-text-emphasized)'
        },
        body: {
          light: '#28282E',
          dark: '#D4D4D8',
          DEFAULT: 'var(--color-text)'
        },
        muted: {
          light: '#5A5A61',
          dark: '#A1A1A8',
          DEFAULT: 'var(--color-text-muted)'
        },
        accent: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)'
        },
        border: {
          light: '#E5DCBD',
          dark: '#323239',
          DEFAULT: 'var(--color-border)'
        },
        'border-card': {
          light: '#DED4B2',
          dark: '#323239',
          DEFAULT: 'var(--color-border-card)'
        },
        'border-strong': {
          light: '#C6BA93',
          dark: '#4E4E55',
          DEFAULT: 'var(--color-border-strong)'
        }
      },
      fontFamily: {
        heading: ['"Outfit"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        display: ['"Outfit"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        sans: ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '6px',
        lg: '8px',
        xl: '12px'
      },
      maxWidth: {
        'content': '760px',
        'content-wide': '1020px',
        'sidebar': '250px',
        'prose-article': '760px'
      },
      screens: {
        sm: '600px',
        md: '800px',
        lg: '1020px',
        xl: '1360px'
      }
    }
  },
  plugins: []
};
