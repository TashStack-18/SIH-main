/**
 * 🇮🇳 BHARAT SAFE YATRA — TERRITORY TYPES
 */

import { Coordinates, VerificationStatus } from './common';

export type TerritoryCode = 
  | 'ANDAMAN_NICOBAR'
  | 'CHANDIGARH'
  | 'DNH_DD'
  | 'DELHI'
  | 'JAMMU_KASHMIR'
  | 'LADAKH'
  | 'LAKSHADWEEP'
  | 'PUDUCHERRY';

export interface TerritoryEmergencyContact {
  name: string;
  number: string;
  category?: string;
}

export interface TerritoryWeatherSnapshot {
  temp: number;
  condition: string;
  humidity: string;
  bestMonths: string;
}

export interface UnionTerritory {
  id: TerritoryCode;
  code: TerritoryCode;
  name: string;
  shortName: string;
  slug: string;
  capital: string;
  historicalName?: string;
  tagline: string;
  heroLabel?: string;
  heroHeading?: string;
  heroDescription?: string;
  shortDescription: string;
  description: string;
  heroImage: string;
  thumbnailImage: string;
  coordinates: Coordinates;
  popularDestinations: string[];
  signatureExperiences: string[];
  weatherSnapshot: TerritoryWeatherSnapshot;
  officialPortal: string;
  verificationStatus: VerificationStatus;
  verifiedBy: string;
  emergencyContacts: TerritoryEmergencyContact[];
  advisories: string[];
}
