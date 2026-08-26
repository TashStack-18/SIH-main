/**
 * 🇮🇳 BHARAT SAFE YATRA — SAFETY & EMERGENCY TYPES
 */

import { Coordinates, VerificationStatus } from './common';
import { TerritoryCode } from './territory';

export type EmergencyFacilityType = 
  | 'HOSPITAL'
  | 'CLINIC'
  | 'POLICE'
  | 'FIRE_STATION'
  | 'COAST_GUARD'
  | 'DISASTER_RESPONSE';

export type AlertSeverity = 'INFO' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface EmergencyNationalContact {
  service: string;
  number: string;
  description: string;
  category: string;
  icon: string;
}

export interface EmergencyFacility {
  id: string;
  name: string;
  territoryId: TerritoryCode;
  territoryName: string;
  type: EmergencyFacilityType;
  address: string;
  phone: string;
  emergencyPhone?: string;
  coordinates: Coordinates;
  services: string[];
  is24x7: boolean;
  verificationStatus: VerificationStatus;
}

export interface ActiveTravelAdvisory {
  id: string;
  territoryId: TerritoryCode;
  territoryName: string;
  title: string;
  severity: AlertSeverity;
  category: string;
  dateIssued: string;
  validThrough?: string;
  summary: string;
  officialSource: string;
}

export interface SOSRequest {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  itineraryId?: string;
}

export interface SOSResponse {
  location: Coordinates;
  nearestHospital: EmergencyFacility;
  nationalContacts: EmergencyNationalContact[];
  status: 'ACTIVE_EMERGENCY';
}
