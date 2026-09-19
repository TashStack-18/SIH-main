/**
 * 🇮🇳 BHARAT SAFE YATRA — GEOSPATIAL MAP TYPES
 */

import { Coordinates } from './common';

export type MapMarkerType = 
  | 'ATTRACTION'
  | 'HOTEL'
  | 'RESTAURANT'
  | 'FESTIVAL'
  | 'EMERGENCY'
  | 'ITINERARY_STOP';

export interface MapMarker {
  id: string;
  title: string;
  type: MapMarkerType;
  coordinates: Coordinates;
  altitude?: string;
  category?: string;
  isEmergency?: boolean;
}

export interface MapRouteStop {
  name: string;
  lat: number;
  lng: number;
  type: string;
}

export interface MapRouteSummary {
  origin: string;
  destination: string;
  distanceKm: number;
  durationFormatted: string;
  stops: MapRouteStop[];
}

export interface MapState {
  activeTab: string;
  selectedDestinationId: string;
  filterType: string;
  is3D: boolean;
  zoom: number;
  center: Coordinates;
  activeRouteDay: number;
}
