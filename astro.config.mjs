import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://fuadhasan.is-a.dev',
  output: 'static',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  integrations: [
    tailwind({
      applyBaseStyles: false
    }),
    sitemap({
      filter: (page) => !page.includes('/404')
    })
  ]
});

