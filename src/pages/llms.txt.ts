import type { APIRoute } from 'astro';
import { bookUrl, getProperty, mapsUrl, unitFeatures, unitPath } from '../lib/property';

// llms.txt (https://llmstxt.org): a plain Markdown summary of the site for AI agents, built from the same data as the pages.
export const GET: APIRoute = async ({ site }) => {
  const property = await getProperty('en');
  const url = (path: string) => new URL(path, site).href;
  const address = [property.address, property.city, property.country].filter(Boolean).join(', ');
  const { googleRating: google, bookingRating: booking } = property;

  const lines = [
    `# ${property.name}`,
    '',
    `> ${property.description}`,
    '',
    `- Address: ${address} ([map](${mapsUrl(property)}))`,
    property.checkIn && `- Check-in: ${property.checkIn}`,
    property.checkOut && `- Check-out: ${property.checkOut}`,
    property.email && `- Email: ${property.email}`,
    `- Book: ${bookUrl(property)} (availability and prices are only on the booking page)`,
    booking && `- Booking.com rating: ${booking.value}/10 from ${booking.count} reviews ([reviews](${booking.url}))`,
    google && `- Google rating: ${google.value}/5 from ${google.count} reviews ([reviews](${google.url}))`,
    '',
    '## Apartments',
    '',
    ...property.units.map(unit => {
      const facts = [
        unit.setting,
        unit.areaSquareMetres && `${unit.areaSquareMetres} m²`,
        unit.occupancyLabel && `sleeps ${unit.occupancyLabel}`,
        ...unit.rooms.map(room => room.beds),
      ].filter(Boolean).join('; ');
      return `- [${unit.name}](${url(unitPath(unit.id))}): ${facts}. Features: ${unitFeatures(unit).join(', ')}.`;
    }),
    '',
    '## Good to know',
    '',
    ...property.narrative.practical.map(item => `- ${item.label}: ${item.value}`),
    '',
    '## Optional',
    '',
    `- [Slovenian version](${url('/sl/')})`,
  ];
  return new Response(lines.filter(line => typeof line === 'string').join('\n') + '\n', {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
