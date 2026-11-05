import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || process.env.CF_PAGES_URL || 'http://localhost:4321',
  output: 'static',
  integrations: [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', sl: 'sl' } } })],
  i18n: { defaultLocale: 'en', locales: ['en', 'sl'], routing: { prefixDefaultLocale: false } },
  // Manrope (variable, 200–800) from the installed @fontsource-variable package; no network at build.
  // Two files split by unicode range: latin for most text, latin-ext for č, š, ž on the Slovenian pages.
  fonts: [{
    provider: fontProviders.local(),
    name: 'Manrope',
    cssVariable: '--font-manrope',
    fallbacks: ['sans-serif'],
    options: {
      variants: [
        {
          weight: '200 800', style: 'normal',
          src: ['@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'],
          unicodeRange: ['U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC', 'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193', 'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD'],
        },
        {
          weight: '200 800', style: 'normal',
          src: ['@fontsource-variable/manrope/files/manrope-latin-ext-wght-normal.woff2'],
          unicodeRange: ['U+0100-02BA', 'U+02BD-02C5', 'U+02C7-02CC', 'U+02CE-02D7', 'U+02DD-02FF', 'U+0304', 'U+0308', 'U+0329', 'U+1D00-1DBF', 'U+1E00-1E9F', 'U+1EF2-1EFF', 'U+2020', 'U+20A0-20AB', 'U+20AD-20C0', 'U+2113', 'U+2C60-2C7F', 'U+A720-A7FF'],
        },
      ],
    },
  }],
  // One small stylesheet: inline it so the first paint needs no extra request.
  build: { inlineStylesheets: 'always' },
  // Fetch same-site pages when a link is hovered or focused, so apartment pages open instantly.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
});
