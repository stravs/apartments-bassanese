# Apartments Bassanese

Standalone static Astro site generated from profile-studio.json.

## Local development

Use Node.js 24.

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Cloudflare Workers

Connect `stravs/apartments-bassanese` in Cloudflare Workers & Pages.

| Setting | Value |
| --- | --- |
| Worker name | `apartments-bassanese` |
| Production branch | `main` |
| Root directory | Repository root (leave blank) |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | 24 (via `.node-version`) |

`wrangler.jsonc` serves the built `dist` directory as static assets. It intentionally has no Worker script or Astro adapter. The explicit config avoids Wrangler's automatic Astro adapter setup.

Set `SITE_URL` in the build environment to the full public HTTPS URL shown by Cloudflare (or your custom domain), then rebuild. This controls canonical URLs and sitemap URLs. Workers does not provide `CF_PAGES_URL`; without `SITE_URL`, the build falls back to localhost for local development.

No runtime secrets or bindings are needed. Data files are read only at build time.

### Preview safeguards

`.data/site.json` has `site.preview: true`: pages emit `noindex,nofollow`, and `robots.txt` blocks crawlers. This is **not access control**. A deployed Worker is public unless separately protected with Cloudflare Access.

Photo reuse rights and current facts still require owner approval. Do not deploy publicly until those are cleared. Keep preview mode enabled until the site is approved for indexing; then set `site.preview` to `false` and rebuild.
