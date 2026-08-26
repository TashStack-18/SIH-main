/**
 * 🇮🇳 BHARAT SAFE YATRA — EMERGENCY SERVICE ORCHESTRATOR
 * Phase 9B: Spatial Emergency Facility Lookup & Life Safety Dispatch
 */

import { EmergencyFacilityProvider } from './emergencyFacilityProvider';
import { EmergencyFacility } from '../types';

const emergencyProvider = new EmergencyFacilityProvider();

export async function getNearbyEmergencyFacilities(lat: number, lng: number, limit = 5): Promise<EmergencyFacility[]> {
  return emergencyProvider.findNearestFacilities(lat, lng, limit);
}

export async function getTerritoryEmergencyFacilities(territorySlug: string): Promise<EmergencyFacility[]> {
  return emergencyProvider.getFacilitiesByTerritory(territorySlug);
}
