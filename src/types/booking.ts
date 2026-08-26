/**
 * 🇮🇳 BHARAT SAFE YATRA — BOOKING & PROVIDER ADAPTER TYPES
 */

export type BookingType = 'ACTIVITY' | 'HOTEL' | 'PACKAGE' | 'TRANSPORT';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface BookingProvider {
  id: string;
  name: string;
  slug: string;
  type: string;
  badge: string;
  url: string;
  status: string;
}

export interface BookableExperience {
  id: string;
  title: string;
  providerId: string;
  providerName: string;
  location: string;
  category: BookingType;
  image: string;
  description: string;
  pricing: string;
  timing: string;
  availabilityStatus: string;
  directUrl: string;
}

export interface UserBooking {
  id: string;
  title: string;
  date: string;
  status: BookingStatus;
  amount: string;
  provider: string;
  reference: string;
}
