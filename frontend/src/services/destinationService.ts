/**
 * 🇮🇳 BHARAT SAFE YATRA — DESTINATION SERVICE (Client-side)
 * Calls: GET /api/v1/destinations, GET /api/v1/destinations/:slug
 *
 * This service is used by React components (client-side).
 * The actual data logic lives in the API route handlers.
 */

import type { ApiResponse, Destination, TerritoryCode } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export interface DestinationFilters {
  territoryId?: TerritoryCode | 'ALL';
  type?: string | 'ALL';
  searchQuery?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export const destinationService = {
  async getDestinations(filters: DestinationFilters = {}): Promise<ApiResponse<Destination[]>> {
    const params = new URLSearchParams();
    if (filters.territoryId && filters.territoryId !== 'ALL') {
      params.set('territory', filters.territoryId);
    }
    if (filters.type && filters.type !== 'ALL') {
      params.set('type', filters.type);
    }
    if (filters.searchQuery) {
      params.set('search', filters.searchQuery);
    }
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const url = `${BASE}/destinations${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      return {
        success: false,
        data: [],
        error: { code: 'FETCH_ERROR', message: `Failed to load destinations (${res.status})` },
      };
    }
    return res.json() as Promise<ApiResponse<Destination[]>>;
  },

  async getDestinationBySlug(slug: string): Promise<ApiResponse<Destination | null>> {
    const res = await fetch(`${BASE}/destinations/${encodeURIComponent(slug)}`, {
      next: { revalidate: 1800 },
    });
    if (!res.ok) {
      if (res.status === 404) {
        return {
          success: false,
          data: null,
          error: { code: 'DESTINATION_NOT_FOUND', message: `Destination "${slug}" not found.` },
        };
      }
      return {
        success: false,
        data: null,
        error: { code: 'FETCH_ERROR', message: `Failed to load destination (${res.status})` },
      };
    }
    return res.json() as Promise<ApiResponse<Destination | null>>;
  },
};
