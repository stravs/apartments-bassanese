import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [sitemap()],
});
