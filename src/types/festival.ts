/**
 * 🇮🇳 BHARAT SAFE YATRA — FESTIVAL TYPES
 */

import { DatePrecision, OfficialSource } from './common';
import { TerritoryCode } from './territory';

export type FestivalCategory = 
  | 'CULTURAL'
  | 'FOOD_CULINARY'
  | 'HERITAGE'
  | 'MUSIC_DANCE'
  | 'RELIGIOUS'
  | 'ADVENTURE_SPORTS';

export interface Festival {
  id: string;
  name: string;
  territoryId: TerritoryCode;
  territoryName: string;
  location: string;
  startDate: string;
  endDate?: string;
  displayDate: string;
  datePrecision: DatePrecision;
  category: FestivalCategory;
  image: string;
  description: string;
  culturalSignificance: string;
  officialSource: OfficialSource;
}
