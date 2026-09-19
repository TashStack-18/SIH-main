/**
 * 🇮🇳 BHARAT SAFE YATRA — DESTINATION TYPES
 */

import { Coordinates, OfficialSource } from './common';
import { TerritoryCode } from './territory';

export type DestinationType = 
  | 'LAKE'
  | 'HERITAGE'
  | 'BEACH'
  | 'ISLAND'
  | 'MOUNTAIN'
  | 'VALLEY'
  | 'PARK'
  | 'CITY'
  | 'GARDEN'
  | 'RELIGIOUS'
  | 'OTHER';

export interface DestinationActivity {
  title: string;
  desc: string;
}

export interface DestinationFood {
  overview: string;
  dishes: string[];
}

export interface DestinationCulture {
  languages: string[];
  traditions: string;
  etiquette: string;
}

export interface DestinationStay {
  types: string[];
  note?: string;
}

export interface DestinationWeather {
  tempSummer: string;
  tempWinter?: string;
  bestTime: string;
  liveStatus: string;
}

export interface DestinationSafety {
  guidelines: string[];
  emergencyFacility: string;
}

export interface DestinationPermit {
  required: boolean;
  name?: string;
  portal?: string;
  verification?: string;
  note?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  territoryId: TerritoryCode;
  territoryName: string;
  type: DestinationType;
  coordinates: Coordinates;
  image: string;
  gallery: string[];
  tagline: string;
  shortDescription: string;
  overview: string;
  whyVisit: string;
  highlights: string[];
  thingsToDo: DestinationActivity[];
  categories: string[];
  food: DestinationFood;
  culture: DestinationCulture;
  stay: DestinationStay;
  weather: DestinationWeather;
  safety: DestinationSafety;
  permits: DestinationPermit;
  source: {
    name: string;
    url: string;
    lastVerified: string;
  };
}
