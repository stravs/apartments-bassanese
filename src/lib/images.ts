import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

const files = import.meta.glob<ImageMetadata>('../assets/images/**/*.{webp,jpg,jpeg,png,avif}', { eager: true, import: 'default' });

/** Source image for a profile photo URL such as /images/<slug>/<id>.webp. */
export function photoSource(url: string): ImageMetadata {
  const source = files[`../assets${url}`];
  if (!source) throw new Error(`No image in src/assets for ${url}`);
  return source;
}

/** Full-size optimised URL, for places that need a plain link (lightbox, metadata). */
export async function photoUrl(url: string): Promise<string> {
  return (await getImage({ src: photoSource(url) })).src;
}
