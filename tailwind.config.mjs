/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        canvas: {
          light: '#F8FAFC',
          dark: '#0B1220'
        },
        surface: {
          light: '#FFFFFF',
          dark: '#111C2D'
        },
        primary: {
          DEFAULT: '#0F172A',
          dark: '#F8FAFC'
        },
        muted: {
          DEFAULT: '#475569',
          dark: '#94A3B8'
        },
        accent: {
          DEFAULT: '#1D4ED8',
          hover: '#1E40AF',
          dark: '#60A5FA',
          'dark-hover': '#93C5FD'
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      maxWidth: {
        'prose-article': '720px'
      }
    }
  },
  plugins: []
};

