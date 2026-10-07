import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

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
  photos: PropertyPhoto[];
  amenities: string[];
  units: PropertyUnit[];
  checkIn?: string;
  checkOut?: string;
  bookingUrl: string;
  narrative: {
    heroTitle: string; heroText: string; introTitle: string; introText: string;
    spacesText?: string; settingTitle?: string; settingText?: string;
    practical: Array<{ label: string; value: string }>;
  };
};

export async function getProperty(): Promise<Property> {
  const path = resolve(process.cwd(), process.env.PROPERTY_DATA_FILE ?? '.data/property.json');
  return JSON.parse(await readFile(path, 'utf8')) as Property;
}

// Preserve readable source IDs; encode unusual IDs without route collisions.
export function unitSlug(id: string): string {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && !id.startsWith('encoded-')
    ? id : `encoded-${Array.from(new TextEncoder().encode(id), byte => byte.toString(16).padStart(2, '0')).join('')}`;
}

export function unitPath(id: string): string {
  return `/units/${unitSlug(id)}`;
}

export function mapsUrl(property: Property): string {
  const query = [property.name, property.address, property.city].join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Keyless Google Maps embed: coordinates when captured, otherwise the address. */
export function mapEmbedUrl(property: Property): string {
  const { latitude, longitude } = property;
  const query = latitude !== undefined && longitude !== undefined
    ? `${latitude},${longitude}` : [property.name, property.address, property.city].join(', ');
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
}

/** Two-digit label for numbered lists: 1 → "01". */
export function pad(value: number): string {
  return String(value).padStart(2, '0');
}
