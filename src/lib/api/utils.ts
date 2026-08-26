/**
 * 🇮🇳 BHARAT SAFE YATRA — API UTILITIES
 * Standardized response format, error handling, and request validation.
 * Phase 8 — Backend Implementation
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================================
// STANDARD ERROR FORMAT (Phase 4 API Contract)
// ============================================================

export interface ApiError {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta?: Partial<PaginationMeta> & {
    lastUpdated?: string;
    source?: string;
    [key: string]: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}

// ============================================================
// RESPONSE BUILDERS
// ============================================================

export function ok<T>(
  data: T,
  meta?: ApiSuccessResponse<T>['meta'],
  status: number = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({ success: true, data, meta }, { status });
}

export function created<T>(data: T, meta?: ApiSuccessResponse<T>['meta']): NextResponse<ApiSuccessResponse<T>> {
  return ok(data, meta, 201);
}

export function apiError(
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error: { statusCode, code, message, ...(details ? { details } : {}) },
    },
    { status: statusCode }
  );
}

// Common error shortcuts
export const Errors = {
  badRequest: (message: string, details?: Record<string, unknown>) =>
    apiError(400, 'BAD_REQUEST', message, details),
  unauthorized: (message = 'Authentication required') =>
    apiError(401, 'UNAUTHORIZED', message),
  forbidden: (message = 'You do not have permission to perform this action') =>
    apiError(403, 'FORBIDDEN', message),
  notFound: (resource: string) =>
    apiError(404, 'NOT_FOUND', `${resource} not found.`),
  conflict: (message: string) =>
    apiError(409, 'CONFLICT', message),
  tooManyRequests: () =>
    apiError(429, 'RATE_LIMIT_EXCEEDED', 'Too many requests. Please slow down.'),
  internalError: (message = 'An internal server error occurred') =>
    apiError(500, 'INTERNAL_SERVER_ERROR', message),
  serviceUnavailable: (service: string) =>
    apiError(503, 'SERVICE_UNAVAILABLE', `${service} is temporarily unavailable.`),
};

// ============================================================
// PAGINATION HELPERS
// ============================================================

export function parsePagination(req: NextRequest): { page: number; limit: number; offset: number } {
  const { searchParams } = req.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10) || 1);
  const rawLimit = parseInt(searchParams.get('limit') ?? '20', 10) || 20;
  // Enforce max limit of 100 to prevent abuse
  const limit = Math.min(100, Math.max(1, rawLimit));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export function paginate<T>(items: T[], page: number, limit: number): T[] {
  const offset = (page - 1) * limit;
  return items.slice(offset, offset + limit);
}

// ============================================================
// GEOGRAPHIC UTILITIES (Haversine — used until PostGIS is live)
// ============================================================

/**
 * Calculate the great-circle distance between two coordinates using the
 * Haversine formula. Returns distance in kilometres.
 */
export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// ============================================================
// INPUT SANITISATION
// ============================================================

/** Strip SQL injection attempt characters from string inputs */
export function sanitizeString(input: string): string {
  return input.replace(/[;'"\\]/g, '').trim();
}

/** Validate that a value is a finite number within a geographic range */
export function isValidLatitude(lat: unknown): lat is number {
  return typeof lat === 'number' && isFinite(lat) && lat >= -90 && lat <= 90;
}

export function isValidLongitude(lng: unknown): lng is number {
  return typeof lng === 'number' && isFinite(lng) && lng >= -180 && lng <= 180;
}

// ============================================================
// REQUEST ID
// ============================================================

export function generateRequestId(): string {
  return `req-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================
// CORS HEADERS (applied per-route where needed)
// ============================================================

export function corsHeaders(): HeadersInit {
  const allowedOrigin = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
    'Access-Control-Allow-Credentials': 'true',
  };
}
