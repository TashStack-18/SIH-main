/**
 * 🇮🇳 DISHAARA — GLOBAL LIVE TRAVEL ALERT SYSTEM TYPES
 * Grounded in Official Government Disaster Management & Tourism Authority Data
 */

export type AlertSeverity = 'INFO' | 'ADVISORY' | 'WARNING' | 'CRITICAL';

export type AlertType = 
  | 'WEATHER' 
  | 'NATURAL_DISASTER' 
  | 'TRAVEL_DISRUPTION' 
  | 'DESTINATION_STATUS';

export type SourceType = 
  | 'GOVERNMENT_DISASTER_MANAGEMENT'
  | 'OFFICIAL_WEATHER_AGENCY'
  | 'TOURISM_DEPARTMENT'
  | 'TRANSPORT_AUTHORITY'
  | 'LOCAL_ADMINISTRATION';

export type AlertVerificationStatus = 
  | 'VERIFIED' 
  | 'VERIFIED_STATIC' 
  | 'LIVE' 
  | 'UPDATED' 
  | 'UNAVAILABLE' 
  | 'UNKNOWN';

export interface RouteCorridor {
  from: string;
  to: string;
  label?: string;
  roadName?: string;
}

export interface EmergencyContactInfo {
  label: string;
  number: string;
  description?: string;
}

export interface TravelAlert {
  alert_id: string;
  alert_type: AlertType;
  category: string; // e.g. 'Flood', 'Flash flood', 'Landslide', 'Road closure', 'Severe storm', 'Permit restriction'
  severity: AlertSeverity;
  title: string;
  message: string;
  short_message: string;
  source_name: string;
  source_url: string;
  source_type: SourceType;
  verification_status: AlertVerificationStatus;
  issued_at: string;
  updated_at: string;
  effective_from: string;
  effective_until: string;
  affected_territory_ids: string[];
  affected_region_ids?: string[];
  affected_destination_ids: string[];
  affected_routes?: RouteCorridor[];
  affected_geometry?: {
    type: 'Point' | 'Polygon' | 'LineString';
    coordinates: number[] | number[][] | number[][][];
  };
  affected_coordinates?: {
    lat: number;
    lng: number;
  };
  recommended_action: string;
  emergency_contacts?: EmergencyContactInfo[];
}

export interface UserTravelContext {
  selectedDestinationId?: string | null;
  currentViewedDestinationSlug?: string | null;
  activeItinerary?: {
    id?: string;
    territoryId?: string;
    startDate?: string;
    endDate?: string;
    destinationIds?: string[];
    routes?: Array<{ from: string; to: string }>;
    stops?: Array<{ destinationId?: string; location?: { lat: number; lng: number } }>;
  } | null;
  userLocation?: { lat: number; lng: number } | null;
  aiSelectedDestinationId?: string | null;
}

export type RelevanceMatchType = 
  | 'DESTINATION'
  | 'ITINERARY'
  | 'ROUTE'
  | 'VIEWED_PAGE'
  | 'LOCATION'
  | 'DATE'
  | 'NONE';

export interface AlertRelevanceEvaluation {
  isRelevant: boolean;
  matchType: RelevanceMatchType;
  matchReason: string;
}
