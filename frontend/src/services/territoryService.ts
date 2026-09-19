/**
 * 🇮🇳 BHARAT SAFE YATRA — TERRITORY SERVICE (Client-side)
 * Calls: GET /api/v1/territories, GET /api/v1/territories/:slug
 *
 * This service is used by React components (client-side).
 * The actual data logic lives in the API route handlers.
 */

import type { ApiResponse, UnionTerritory } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export const territoryService = {
  async getTerritories(): Promise<ApiResponse<UnionTerritory[]>> {
    const res = await fetch(`${BASE}/territories`, { next: { revalidate: 3600 } });
    if (!res.ok) {
      return {
        success: false,
        data: [],
        error: { code: 'FETCH_ERROR', message: `Failed to load territories (${res.status})` },
      };
    }
    return res.json() as Promise<ApiResponse<UnionTerritory[]>>;
  },

  async getTerritoryBySlug(slug: string): Promise<ApiResponse<UnionTerritory | null>> {
    const res = await fetch(`${BASE}/territories/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      if (res.status === 404) {
        return {
          success: false,
          data: null,
          error: { code: 'TERRITORY_NOT_FOUND', message: `Union Territory "${slug}" not found.` },
        };
      }
      return {
        success: false,
        data: null,
        error: { code: 'FETCH_ERROR', message: `Failed to load territory (${res.status})` },
      };
    }
    return res.json() as Promise<ApiResponse<UnionTerritory | null>>;
  },
};
