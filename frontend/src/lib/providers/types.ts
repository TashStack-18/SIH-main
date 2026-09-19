/**
 * 🇮🇳 BHARAT SAFE YATRA — PROVIDER TYPES & CONTRACT INTERFACES
 * Phase 9B: Real Provider Integration
 */

export type DataFreshnessStatus = 'LIVE' | 'CACHED' | 'FALLBACK' | 'UNAVAILABLE';

export interface FreshnessMetadata {
  provider: string;
  source: string;
  retrievedAt: string;
  expiresAt?: string;
  status: DataFreshnessStatus;
  isLive: boolean;
  latencyMs?: number;
}

// -------------------------------------------------------------
// 1. WEATHER & MARINE
// -------------------------------------------------------------
export interface WeatherCondition {
  tempC: number;
  feelsLikeC: number;
  humidityPercent: number;
  windSpeedKmh: number;
  windDirectionDeg?: number;
  conditionText: string;
  conditionCode: number;
  uvIndex?: number;
  visibilityKm?: number;
  airQualityIndex?: number; // 1-5 or AQI (PM2.5 / PM10)
  airQualityBand?: 'GOOD' | 'MODERATE' | 'POOR' | 'UNHEALTHY' | 'HAZARDOUS';
}

export interface WeatherForecastDay {
  date: string;
  maxTempC: number;
  minTempC: number;
  conditionText: string;
  precipitationChancePercent: number;
  precipitationMm: number;
}

export interface MarineSwellData {
  waveHeightMeters: number;
  swellDirectionDeg: number;
  waterTempC: number;
  tideState?: 'HIGH' | 'LOW' | 'RISING' | 'FALLING';
  ferrySafetyAdvisory?: 'SAFE_SAILING' | 'CAUTION_ROUGH_SEA' | 'SUSPENDED';
}

export interface WeatherDataResponse {
  current: WeatherCondition;
  forecast: WeatherForecastDay[];
  marine?: MarineSwellData;
  metadata: FreshnessMetadata;
}

export interface IWeatherProvider {
  name: string;
  getWeatherByCoords(lat: number, lng: number): Promise<WeatherDataResponse | null>;
}

// -------------------------------------------------------------
// 2. MAPS & ROUTING
// -------------------------------------------------------------
export interface RouteWaypoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteSegment {
  distanceMeters: number;
  durationSeconds: number;
  instruction?: string;
}

export interface RouteCalculationResult {
  totalDistanceKm: number;
  totalDurationMinutes: number;
  mode: 'driving' | 'walking' | 'cycling';
  geometryGeoJSON: {
    type: 'LineString';
    coordinates: Array<[number, number]>; // [lng, lat] pairs
  };
  segments: RouteSegment[];
  waypoints: RouteWaypoint[];
  metadata: FreshnessMetadata;
}

export interface GeocodingFeature {
  id: string;
  placeName: string;
  center: [number, number]; // [lng, lat]
  territorySlug?: string;
  relevance: number;
  category?: string;
}

export interface MatrixPair {
  originIndex: number;
  destinationIndex: number;
  durationMinutes: number;
  distanceKm: number;
}

export interface MatrixCalculationResult {
  durations: number[][]; // [originIndex][destinationIndex] in minutes
  distances: number[][]; // [originIndex][destinationIndex] in km
  origins: RouteWaypoint[];
  destinations: RouteWaypoint[];
  metadata: FreshnessMetadata;
}

export interface IMapProvider {
  name: string;
  calculateRoute(waypoints: RouteWaypoint[], mode?: 'driving' | 'walking' | 'cycling'): Promise<RouteCalculationResult | null>;
  searchGeocoding(query: string, proximity?: [number, number]): Promise<GeocodingFeature[] | null>;
  calculateMatrix?(origins: RouteWaypoint[], destinations: RouteWaypoint[], mode?: 'driving' | 'walking' | 'cycling'): Promise<MatrixCalculationResult | null>;
}

// -------------------------------------------------------------
// 3. FLIGHTS & AVIATION
// -------------------------------------------------------------
export interface FlightSegment {
  airlineCode: string;
  airlineName: string;
  flightNumber: string;
  departureAirport: string;
  departureCity: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCity: string;
  arrivalTime: string;
  durationMinutes: number;
}

export interface FlightOffer {
  id: string;
  provider: string;
  sourceAirport: string;
  destinationAirport: string;
  departureDate: string;
  priceINR: number;
  currency: string;
  cabinClass: 'ECONOMY' | 'PREMIUM_ECONOMY' | 'BUSINESS' | 'FIRST';
  stopsCount: number;
  segments: FlightSegment[];
  bookingDeepLink?: string;
  metadata: FreshnessMetadata;
}

export interface IFlightProvider {
  name: string;
  searchFlights(origin: string, destination: string, departureDate: string, adults?: number): Promise<FlightOffer[] | null>;
}

// -------------------------------------------------------------
// 4. ACCOMMODATION & HOTELS
// -------------------------------------------------------------
export interface HotelProperty {
  id: string;
  name: string;
  propertyType: 'HOTEL' | 'RESORT' | 'GOVT_GUEST_HOUSE' | 'ECO_CAMP' | 'HERITAGE_STAY';
  territoryId: string;
  city: string;
  ratingStars?: number;
  pricePerNightINR?: number;
  currency: string;
  isOfficialGovtStay: boolean;
  provider: string;
  officialBookingUrl: string;
  amenities: string[];
  coordinates?: { lat: number; lng: number };
  metadata: FreshnessMetadata;
}

export interface IAccommodationProvider {
  name: string;
  searchHotels(cityCodeOrTerritory: string, checkInDate?: string, checkOutDate?: string, guests?: number): Promise<HotelProperty[] | null>;
}

// -------------------------------------------------------------
// 5. CURRENCY & FOREX
// -------------------------------------------------------------
export interface CurrencyExchangeResult {
  baseCurrency: string;
  targetCurrency: string;
  rate: number;
  convertedAmount: number;
  metadata: FreshnessMetadata;
}

export interface ICurrencyProvider {
  name: string;
  getExchangeRates(baseCurrency?: string): Promise<Record<string, number> | null>;
  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<CurrencyExchangeResult | null>;
}

// -------------------------------------------------------------
// 6. PAYMENTS & TRANSACTIONS
// -------------------------------------------------------------
export interface PaymentOrderParams {
  amountINR: number;
  currency: string;
  receiptId: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  notes?: Record<string, string>;
}

export interface PaymentOrderResult {
  orderId: string;
  amountINR: number;
  currency: string;
  gatewayKeyId: string;
  provider: string;
  status: 'CREATED' | 'ATTEMPTED' | 'PAID';
  createdAt: string;
}

export interface PaymentVerificationParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

export interface IPaymentProvider {
  name: string;
  createOrder(params: PaymentOrderParams): Promise<PaymentOrderResult>;
  verifyPaymentSignature(params: PaymentVerificationParams): boolean;
}

// -------------------------------------------------------------
// 7. EMERGENCY & LIFE SAFETY
// -------------------------------------------------------------
export interface EmergencyFacility {
  id: string;
  name: string;
  facilityType: 'TRAUMA_CENTER' | 'DISTRICT_HOSPITAL' | 'OXYGEN_BAR' | 'COAST_GUARD' | 'POLICE_STATION';
  territorySlug: string;
  address: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  distanceKm?: number;
  has24x7ICU: boolean;
  hasHyperbaricOxygen: boolean;
  officialGovtId: string;
  metadata: FreshnessMetadata;
}
