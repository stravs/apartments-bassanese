import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { Locale } from './i18n';

export type PropertyPhoto = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  srcSet?: string;
};

export type PropertyRoom = {
  name: string;
  description?: string;
  sleeps?: number;
  beds?: string;
};

export type PropertyPrice = {
  /** Display-ready reviewed rate text, for example "From €120 / night". */
  label: string;
  /** Optional short condition text, for example "seasonal; check Booking.com for live availability". */
  note?: string;
};

export type PropertyUnit = {
  id: string;
  name: string;
  type?: string;
  description?: string;
  /** Reviewed short facts taken from the description, shown as pills. */
  highlights?: string[];
  /** Reviewed short line: where the unit sits and what it opens onto. */
  setting?: string;
  maxGuests?: number;
  bedrooms?: number;
  bathrooms?: number;
  areaSquareMetres?: number;
  rooms: PropertyRoom[];
  amenities: string[];
  photos: PropertyPhoto[];
  bookingUrl?: string;
  occupancyLabel?: string;
  /** Reviewed display price. Never inferred from live availability. */
  price?: string | PropertyPrice;
  priceNote?: string;
};

export type Property = {
  name: string;
  type?: string;
  description: string;
  address?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  /** Reviewed Google rating (out of 5), shown in the hero. Not added to structured data: Google ignores self-served ratings. */
  googleRating?: { value: number; count: number; url: string };
  photos: PropertyPhoto[];
  amenities: string[];
  units: PropertyUnit[];
  checkIn?: string;
  checkOut?: string;
  /** Contact email shown in the footer. */
  email?: string;
  bookingUrl: string;
  /** Owner's own booking page (Snapguest). Book buttons use it when set. */
  directBookingUrl?: string;
  narrative: {
    heroTitle: string; heroText: string; introTitle: string; introText: string;
    spacesText?: string; settingTitle?: string; settingText?: string;
    practical: Array<{ label: string; value: string }>;
  };
};

type Translation = Partial<Pick<Property, 'description' | 'country' | 'amenities'>> & {
  narrative?: Partial<Property['narrative']>;
  units?: Record<string, Partial<Pick<PropertyUnit, 'name' | 'description' | 'setting' | 'highlights' | 'amenities' | 'occupancyLabel' | 'rooms'>>>;
  /** English alt text → translated alt text. */
  photoAlts?: Record<string, string>;
};

/** Property data. For Slovenian, .data/property.sl.json holds only translated fields: units match by id, photo alt text by the English alt. */
export async function getProperty(locale: Locale = 'en'): Promise<Property> {
  const path = resolve(process.cwd(), process.env.PROPERTY_DATA_FILE ?? '.data/property.json');
  const property = JSON.parse(await readFile(path, 'utf8')) as Property;
  if (locale === 'en') return property;
  const translation = JSON.parse(await readFile(path.replace(/\.json$/, `.${locale}.json`), 'utf8')) as Translation;
  const { narrative, units, photoAlts, ...fields } = translation;
  const alt = (photo: PropertyPhoto): PropertyPhoto => {
    const translated = photo.alt && photoAlts?.[photo.alt];
    return translated ? { ...photo, alt: translated } : photo;
  };
  return {
    ...property,
    ...fields,
    narrative: { ...property.narrative, ...narrative },
    photos: property.photos.map(alt),
    units: property.units.map((unit) => ({ ...unit, ...units?.[unit.id], photos: unit.photos.map(alt) })),
  };
}

// Preserve readable source IDs; encode unusual IDs without route collisions.
export function unitSlug(id: string): string {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !id.startsWith('encoded-')
    ? id : `encoded-${Array.from(new TextEncoder().encode(id), byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function unitPath(id: string): string {
  return `/units/${unitSlug(id)}`;
}

/** Booking.com links open in the page language (…/apartments-bassanese.sl.html). */
export function bookUrl(property: Property, unit?: PropertyUnit, locale: Locale = 'en'): string {
  const url = property.directBookingUrl ?? unit?.bookingUrl ?? property.bookingUrl;
  return locale === 'en' ? url : url.replace(/\.en-gb\.html/, `.${locale}.html`);
}

export function mapsUrl(property: Property): string {
  const query = [property.name, property.address, property.city].join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Keyless Google Maps embed: coordinates when captured, otherwise the address. */
export function mapEmbedUrl(property: Property, locale: Locale = 'en'): string {
  const { latitude, longitude } = property;
  const query = latitude !== undefined && longitude !== undefined
    ? `${latitude},${longitude}` : [property.name, property.address, property.city].join(', ');
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&hl=${locale}&output=embed`;
}

/** Two-digit label for numbered lists: 1 → "01". */
export function pad(value: number): string {
  return String(value).padStart(2, '0');
}
