/**
 * 🇮🇳 BHARAT SAFE YATRA — FESTIVAL SERVICE (Client-side)
 * Calls: GET /api/v1/festivals
 */

import type { ApiResponse, Festival, TerritoryCode } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export interface FestivalFilters {
  territoryId?: TerritoryCode | 'ALL';
  category?: string | 'ALL';
  month?: number | 'ALL';
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export const festivalService = {
  async getFestivals(filters: FestivalFilters = {}): Promise<ApiResponse<Festival[]>> {
    const params = new URLSearchParams();
    if (filters.territoryId && filters.territoryId !== 'ALL') {
      params.set('territory', filters.territoryId);
    }
    if (filters.category && filters.category !== 'ALL') {
      params.set('category', filters.category);
    }
    if (filters.month && filters.month !== 'ALL') {
      params.set('month', String(filters.month));
    }
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));

    const url = `${BASE}/festivals${params.toString() ? `?${params}` : ''}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return { success: false, data: [], error: { code: 'FETCH_ERROR', message: 'Failed to load festivals' } };
    return res.json() as Promise<ApiResponse<Festival[]>>;
  },

  async getFestivalById(id: string): Promise<ApiResponse<Festival | null>> {
    // Festival detail is served from the list endpoint with ID filter
    const res = await fetch(`${BASE}/festivals?page=1&limit=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return { success: false, data: null, error: { code: 'FETCH_ERROR', message: 'Failed to load festival' } };
    const all = await res.json() as ApiResponse<Festival[]>;
    const found = all.data?.find(f => f.id === id) ?? null;
    if (!found) return { success: false, data: null, error: { code: 'FESTIVAL_NOT_FOUND', message: `Festival "${id}" not found.` } };
    return { success: true, data: found };
  },
};
