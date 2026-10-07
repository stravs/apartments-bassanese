import type { APIRoute } from 'astro';
import { getSiteConfig } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const config = await getSiteConfig();
  const content = config.site.preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap-index.xml', site).href}\n`;
  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
