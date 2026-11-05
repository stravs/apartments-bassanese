export const locales = ['en', 'sl'] as const;
export type Locale = (typeof locales)[number];

export function toLocale(value: string | undefined): Locale {
  return value === 'sl' ? 'sl' : 'en';
}

/** Path in the given language. English has no prefix; Slovenian lives under /sl. */
export function localePath(locale: Locale, path: string): string {
  return locale === 'en' ? path : `/sl${path}`;
}

/** The same page in the other language. */
export function alternatePath(pathname: string, target: Locale): string {
  const base = pathname.replace(/^\/sl(?=\/|$)/, '') || '/';
  return localePath(target, base);
}

const en = {
  htmlLang: 'en',
  ogLocale: 'en_US',
  languageName: 'English',
  languageShort: 'EN',
  skip: 'Skip to content',
  menu: 'Menu',
  close: 'Close',
  mainNav: 'Main navigation',
  home: (name: string) => `${name} home`,
  apartments: 'Apartments',
  location: 'Location',
  goodToKnow: 'Good to know',
  bookNow: 'Book now',
  accommodation: 'Accommodation',
  practicalTitle: ['The useful', 'little things.'],
  exploreTitle: ['Explore', 'the house.'],
  otherTitle: ['Check other', 'apartments.'],
  ctaTitle: ['Ready when', 'you are.'],
  propertyHighlights: 'Property highlights',
  heroAlt: 'Lake Bled and its island church, with forested hills behind',
  exteriorAlt: 'The house and driveway at Apartments Bassanese',
  mapTitle: (name: string) => `Map showing ${name}`,
  viewPhotos: (name: string) => `View photos of ${name}`,
  morePhotos: (name: string) => `More photos of ${name}`,
  viewPhoto: (n: number, name: string) => `View photo ${n} of ${name}`,
  photosSoon: 'Photos coming soon',
  googleReviews: (n: number) => `${n} Google ${n === 1 ? 'review' : 'reviews'}`,
  loadMore: 'Load more',
  galleryLabel: 'Accommodation unit photos',
  closeGallery: 'Close gallery',
  previousPhoto: 'Previous photo',
  nextPhoto: 'Next photo',
  photo: 'Photo',
};

export type Strings = typeof en;

const sl: Strings = {
  htmlLang: 'sl',
  ogLocale: 'sl_SI',
  languageName: 'Slovenščina',
  languageShort: 'SL',
  skip: 'Preskoči na vsebino',
  menu: 'Meni',
  close: 'Zapri',
  mainNav: 'Glavna navigacija',
  home: (name) => `${name} – domov`,
  apartments: 'Apartmaji',
  location: 'Lokacija',
  goodToKnow: 'Dobro je vedeti',
  bookNow: 'Rezerviraj',
  accommodation: 'Nastanitev',
  practicalTitle: ['Koristne', 'malenkosti.'],
  exploreTitle: ['Raziščite', 'hišo.'],
  otherTitle: ['Oglejte si', 'druge apartmaje.'],
  ctaTitle: ['Mi smo pripravljeni,', 'kaj pa vi?'],
  propertyHighlights: 'Prednosti nastanitve',
  heroAlt: 'Blejsko jezero z otokom in gozdnatimi hribi v ozadju',
  exteriorAlt: 'Hiša in dovoz do apartmajev Bassanese',
  mapTitle: (name) => `Zemljevid: ${name}`,
  viewPhotos: (name) => `Oglejte si fotografije: ${name}`,
  morePhotos: (name) => `Več fotografij: ${name}`,
  viewPhoto: (n, name) => `Fotografija ${n}: ${name}`,
  photosSoon: 'Fotografije kmalu',
  // Slovenian plural: 1 ocena, 2 oceni, 3–4 ocene, 5+ ocen (by the last two digits).
  googleReviews: (n) => `${n} ${[, 'ocena', 'oceni', 'ocene', 'ocene'][n % 100] ?? 'ocen'} na Googlu`,
  loadMore: 'Naloži več',
  galleryLabel: 'Fotografije apartmaja',
  closeGallery: 'Zapri galerijo',
  previousPhoto: 'Prejšnja fotografija',
  nextPhoto: 'Naslednja fotografija',
  photo: 'Fotografija',
};

export function strings(locale: Locale): Strings {
  return locale === 'sl' ? sl : en;
}
