/**
 * 🇮🇳 BHARAT SAFE YATRA — VERIFIED BOOKING PROVIDER REGISTRY
 *
 * Centralized configuration for all external booking handoffs.
 * Strict rules:
 * - Only verified HTTPS URLs
 * - No fake or placeholder portals
 * - Official government sources take precedence
 */

export type BookingServiceCategory =
  | 'FLIGHTS'
  | 'STAYS'
  | 'TRAINS'
  | 'LOCAL_TRANSPORT'
  | 'GUIDES_EXPERIENCES'
  | 'TEMPLE_DARSHAN';

export type ProviderSourceType = 'OFFICIAL_GOVERNMENT' | 'VERIFIED_COMMERCIAL' | 'TOURISM_BOARD';

export interface VerifiedBookingProvider {
  id: string;
  provider: string;
  destination: string | 'ALL';
  service: BookingServiceCategory;
  url: string;
  source: string;
  sourceType: ProviderSourceType;
  verifiedAt: string;
}

export const VERIFIED_BOOKING_REGISTRY: VerifiedBookingProvider[] = [
  // --- FLIGHTS ---
  {
    id: 'flights-skyscanner-india',
    provider: 'Skyscanner',
    destination: 'ALL',
    service: 'FLIGHTS',
    url: 'https://www.skyscanner.co.in/',
    source: 'Skyscanner India',
    sourceType: 'VERIFIED_COMMERCIAL',
    verifiedAt: '2026-09-18'
  },

  // --- STAYS ---
  {
    id: 'stays-airbnb',
    provider: 'Airbnb',
    destination: 'ALL',
    service: 'STAYS',
    url: 'https://www.airbnb.co.in/',
    source: 'Airbnb India',
    sourceType: 'VERIFIED_COMMERCIAL',
    verifiedAt: '2026-09-18'
  },

  // --- TRAINS ---
  {
    id: 'trains-irctc',
    provider: 'IRCTC',
    destination: 'ALL',
    service: 'TRAINS',
    url: 'https://www.irctc.co.in/',
    source: 'Indian Railway Catering and Tourism Corporation',
    sourceType: 'OFFICIAL_GOVERNMENT',
    verifiedAt: '2026-09-18'
  },

  // --- LOCAL TRANSPORT ---
  {
    id: 'transport-uber',
    provider: 'Uber',
    destination: 'ALL',
    service: 'LOCAL_TRANSPORT',
    url: 'https://www.uber.com/in/en/',
    source: 'Uber India',
    sourceType: 'VERIFIED_COMMERCIAL',
    verifiedAt: '2026-09-18'
  },

  // --- GUIDES & EXPERIENCES ---

  {
    id: 'guides-desh',
    provider: 'Ministry of Tourism (DESH)',
    destination: 'ALL',
    service: 'GUIDES_EXPERIENCES',
    url: 'https://tourism.gov.in/',
    source: 'Ministry of Tourism, Government of India',
    sourceType: 'OFFICIAL_GOVERNMENT',
    verifiedAt: '2026-09-18'
  },

  // --- TEMPLE / DARSHAN ---
  {
    id: 'darshan-vaishno-devi',
    provider: 'Shri Mata Vaishno Devi Shrine Board',
    destination: 'Jammu & Kashmir',
    service: 'TEMPLE_DARSHAN',
    url: 'https://www.maavaishnodevi.org/',
    source: 'Shri Mata Vaishno Devi Shrine Board',
    sourceType: 'OFFICIAL_GOVERNMENT',
    verifiedAt: '2026-09-18'
  },
  {
    id: 'darshan-tirupati',
    provider: 'Tirumala Tirupati Devasthanams',
    destination: 'Andhra Pradesh',
    service: 'TEMPLE_DARSHAN',
    url: 'https://tirupatibalaji.ap.gov.in/',
    source: 'Tirumala Tirupati Devasthanams',
    sourceType: 'OFFICIAL_GOVERNMENT',
    verifiedAt: '2026-09-18'
  }
];

export const UT_ESSENTIALS = [
  {
    destinationId: 'Ladakh',
    title: 'LADAKH ESSENTIALS',
    description: 'Official Ladakh Tourism: Verified services, travel information and destination guidance.',
    provider: 'Official Ladakh Tourism',
    url: 'https://tourism.ladakh.gov.in/'
  }
];

export const TOURHQ_DESTINATION_MAPPING: Record<string, string> = {
  // City-level (Highest precedence)
  'daman': 'https://www.tourhq.com/india/daman/tour-guides',
  'diu': 'https://www.tourhq.com/india/diu/tour-guides',
  'jammu': 'https://www.tourhq.com/india/jammu/tour-guides',
  'srinagar': 'https://www.tourhq.com/india/srinagar/tour-guides',
  'port blair': 'https://www.tourhq.com/india/port-blair/tour-guides',

  // UT-level
  'andaman & nicobar': 'https://www.tourhq.com/india/port-blair/tour-guides',
  'andaman and nicobar islands': 'https://www.tourhq.com/india/port-blair/tour-guides',
  'chandigarh': 'https://www.tourhq.com/india/chandigarh/tour-guides',
  'dadra & nagar haveli and daman & diu': 'https://www.tourhq.com/india/daman/tour-guides',
  'delhi': 'https://www.tourhq.com/india/delhi/tour-guides',
  'jammu & kashmir': 'https://www.tourhq.com/india/srinagar/tour-guides',
  'ladakh': 'https://www.tourhq.com/india/ladakh/tour-guides',
  'lakshadweep': 'https://www.tourhq.com/india/lakshadweep/tour-guides',
  'puducherry': 'https://www.tourhq.com/india/pondicherry/tour-guides',
  'pondicherry': 'https://www.tourhq.com/india/pondicherry/tour-guides'
};

export function getTourHQUrl(destination: string): string | null {
  if (!destination) return null;
  const normalized = destination.toLowerCase().trim();

  // Exact match
  if (TOURHQ_DESTINATION_MAPPING[normalized]) {
    return TOURHQ_DESTINATION_MAPPING[normalized];
  }

  // Substring match for cities/UTs
  for (const [key, url] of Object.entries(TOURHQ_DESTINATION_MAPPING)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }

  return null;
}
