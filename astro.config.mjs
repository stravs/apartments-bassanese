import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321',
  output: 'static',
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', sl: 'sl' } } })],
  i18n: { defaultLocale: 'en', locales: ['en', 'sl'], routing: { prefixDefaultLocale: false } },
});
