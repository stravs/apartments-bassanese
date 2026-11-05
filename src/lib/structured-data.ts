import { bookUrl, unitFeatures, type Property, type PropertyUnit } from './property';
import type { Locale } from './i18n';

// schema.org JSON-LD for search engines and AI agents. Only facts from the reviewed profile; no ratings
// (Google treats a business's own rating markup as self-serving and ignores it).

const features = (names: string[]) =>
  names.map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true }));

/** "14:00–20:00" → "14:00" (first) or "20:00" (last). */
const time = (range: string | undefined, part: 'first' | 'last') => {
  const times = range?.match(/\d{1,2}:\d{2}/g);
  return part === 'first' ? times?.[0] : times?.at(-1);
};

/** One apartment, as listed on the home page and described on its own page. */
export function accommodation(unit: PropertyUnit, url: string, images: string[]) {
  return {
    '@type': 'Accommodation',
    '@id': `${url}#accommodation`,
    name: unit.name,
    url,
    description: unit.description,
    image: images,
    floorSize: unit.areaSquareMetres ? { '@type': 'QuantitativeValue', value: unit.areaSquareMetres, unitCode: 'MTK' } : undefined,
    // Adults and children are kept apart in the label ("2 adults, 1 child"); a single number would blur them.
    occupancy: unit.occupancyLabel ? { '@type': 'QuantitativeValue', description: unit.occupancyLabel } : undefined,
    bed: unit.rooms.map(room => room.beds).filter(Boolean).join(', ') || undefined,
    amenityFeature: features(unitFeatures(unit)),
  };
}

/** The property as a whole, with its apartments and how to book. */
export function lodgingBusiness(property: Property, locale: Locale, homeUrl: string, images: string[], units: ReturnType<typeof accommodation>[]) {
  return {
    '@type': 'LodgingBusiness',
    '@id': `${homeUrl}#lodging`,
    name: property.name,
    url: homeUrl,
    description: property.description,
    image: images,
    email: property.email,
    address: { '@type': 'PostalAddress', streetAddress: property.address, addressLocality: property.city, addressCountry: property.country },
    geo: property.latitude !== undefined && property.longitude !== undefined ? { '@type': 'GeoCoordinates', latitude: property.latitude, longitude: property.longitude } : undefined,
    checkinTime: time(property.checkIn, 'first'),
    checkoutTime: time(property.checkOut, 'last'),
    amenityFeature: features(property.amenities),
    sameAs: [property.bookingUrl],
    potentialAction: { '@type': 'ReserveAction', target: bookUrl(property, undefined, locale) },
    containsPlace: units,
  };
}
