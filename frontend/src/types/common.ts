/**
 * 🇮🇳 BHARAT SAFE YATRA — COMMON TYPES & ENUMS
 * Strict Alignment with Phase 3 Schema & Phase 4 API Specs
 */

export type VerificationStatus = 
  | 'PENDING_REVIEW'
  | 'VERIFIED_PRIMARY'
  | 'VERIFIED_GOVERNMENT'
  | 'VERIFIED_SECONDARY'
  | 'OUTDATED'
  | 'REJECTED';

export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DISABLED';

export type DatePrecision = 
  | 'EXACT_DATE'
  | 'DATE_RANGE'
  | 'MONTH'
  | 'WEEK_OF_MONTH'
  | 'SEASON'
  | 'ANNUAL'
  | 'TBD';

export interface Coordinates {
  lat: number;
  lng: number;
  altitude?: string;
  elevationMeters?: number;
}

export interface OfficialSource {
  name: string;
  url: string;
  retrievedAt?: string;
  verificationStatus: VerificationStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    lastUpdated?: string;
    note?: string;
    [key: string]: unknown;
  };
  error?: {
    code: string;
    message: string;
    details?: any;
    requestId?: string;
  } | null;
}
