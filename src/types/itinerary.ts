/**
 * 🇮🇳 BHARAT SAFE YATRA — ITINERARY TYPES
 */

import { Coordinates } from './common';
import { TerritoryCode } from './territory';

export type ItineraryItemType = 
  | 'DESTINATION'
  | 'ATTRACTION'
  | 'EXPERIENCE'
  | 'HOTEL'
  | 'RESTAURANT'
  | 'TRANSPORT'
  | 'HERITAGE'
  | 'MONUMENT'
  | 'VIEWPOINT'
  | 'ACTIVITY'
  | 'CUSTOM';

export type StopStatus = 
  | 'PLANNED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'SKIPPED'
  | 'REMOVED';

export type TravelStyle = 
  | 'ADVENTURE'
  | 'HERITAGE'
  | 'NATURE'
  | 'PHOTOGRAPHY'
  | 'RELAXED'
  | 'FAMILY'
  | 'CULTURAL'
  | 'BALANCED'
  | 'FAST-PACED';

export interface ItineraryItem {
  id: string;
  time: string;
  title: string;
  type: ItineraryItemType;
  destinationId?: string;
  notes?: string;
  durationMinutes?: number;
  estimatedCost?: number;
  location?: Coordinates;
  status?: StopStatus;
  isMustVisit?: boolean;
  isLocked?: boolean;
  detourMinutes?: number;
  detourDistanceKm?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  date?: string;
  summary: string;
  items: ItineraryItem[];
  estimatedCost?: number;
}

export interface BudgetItem {
  category: string;
  amount: number;
}

export interface PackingItem {
  id: string;
  name: string;
  category: string;
  isRequired: boolean;
  isChecked: boolean;
}

export interface OptimizationProposal {
  id: string;
  currentSequence: string[];
  suggestedSequence: string[];
  savedDistanceKm: number;
  savedDurationMinutes: number;
  rationale: string;
  itinerary: Itinerary;
}

export interface ItineraryPlanRequest {
  destinationId: string;
  additionalDestinationIds?: string[];
  durationDays: number;
  travelStyle: TravelStyle;
  travellers?: number;
  startDate?: string;
  interests?: string[];
  constraints?: string[];
}

export interface Itinerary {
  id: string;
  title: string;
  territoryId: TerritoryCode;
  territoryName: string;
  durationDays: number;
  travellers: number;
  startDate?: string;
  endDate?: string;
  travelStyle: TravelStyle;
  estimatedBudget: number;
  days: ItineraryDay[];
  primaryDestinationId?: string;
  selectedDestinationIds?: string[];
  version?: number;
}
