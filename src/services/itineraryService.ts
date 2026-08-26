/**
 * 🇮🇳 BHARAT SAFE YATRA — ITINERARY SERVICE (Client-side)
 * Calls: GET/POST /api/v1/itineraries, GET/PATCH/DELETE /api/v1/itineraries/:id
 *
 * Fixes E-06: Itineraries are now server-persisted (not localStorage).
 * Guest sessions are supported via guestSessionId until user registers.
 */

import type { ApiResponse, Itinerary } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('bsy_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getGuestSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('bsy_guest_session_id');
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('bsy_guest_session_id', id);
  }
  return id;
}

export const itineraryService = {
  async getItineraries(): Promise<ApiResponse<Itinerary[]>> {
    const authHeaders = getAuthHeaders();
    const guestId = getGuestSessionId();
    const hasAuth = !!authHeaders.Authorization;

    const url = hasAuth
      ? `${BASE}/itineraries`
      : `${BASE}/itineraries?guest_session_id=${encodeURIComponent(guestId)}`;

    const res = await fetch(url, {
      headers: { ...authHeaders },
      cache: 'no-store',
    });
    if (!res.ok) return { success: false, data: [], error: { code: 'FETCH_ERROR', message: 'Failed to load itineraries' } };
    return res.json() as Promise<ApiResponse<Itinerary[]>>;
  },

  async getItinerary(id: string): Promise<ApiResponse<Itinerary>> {
    const authHeaders = getAuthHeaders();
    const guestId = getGuestSessionId();
    const hasAuth = !!authHeaders.Authorization;

    const url = hasAuth
      ? `${BASE}/itineraries/${encodeURIComponent(id)}`
      : `${BASE}/itineraries/${encodeURIComponent(id)}?guest_session_id=${encodeURIComponent(guestId)}`;

    const res = await fetch(url, { headers: authHeaders, cache: 'no-store' });
    if (!res.ok) return { success: false, data: null as unknown as Itinerary, error: { code: 'NOT_FOUND', message: 'Itinerary not found' } };
    return res.json() as Promise<ApiResponse<Itinerary>>;
  },

  async createItinerary(data: Partial<Itinerary>): Promise<ApiResponse<Itinerary>> {
    const authHeaders = getAuthHeaders();
    const guestId = getGuestSessionId();
    const hasAuth = !!authHeaders.Authorization;

    const res = await fetch(`${BASE}/itineraries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ ...data, ...(!hasAuth ? { guestSessionId: guestId } : {}) }),
      cache: 'no-store',
    });
    if (!res.ok) return { success: false, data: null as unknown as Itinerary, error: { code: 'CREATE_ERROR', message: 'Failed to create itinerary' } };
    return res.json() as Promise<ApiResponse<Itinerary>>;
  },

  async updateItinerary(id: string, updates: Partial<Itinerary>): Promise<ApiResponse<Itinerary>> {
    const authHeaders = getAuthHeaders();
    const res = await fetch(`${BASE}/itineraries/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(updates),
      cache: 'no-store',
    });
    if (!res.ok) return { success: false, data: null as unknown as Itinerary, error: { code: 'UPDATE_ERROR', message: 'Failed to update itinerary' } };
    return res.json() as Promise<ApiResponse<Itinerary>>;
  },

  async resizeDuration(itinerary: Itinerary, newDays: number): Promise<ApiResponse<Itinerary>> {
    // Resize is a specialized update operation
    return this.updateItinerary(itinerary.id, {
      durationDays: newDays,
      estimatedBudget: Math.round(itinerary.estimatedBudget * (newDays / itinerary.durationDays)),
    });
  },

  async deleteItinerary(id: string): Promise<ApiResponse<{ deleted: boolean }>> {
    const authHeaders = getAuthHeaders();
    const res = await fetch(`${BASE}/itineraries/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: authHeaders,
      cache: 'no-store',
    });
    if (!res.ok) return { success: false, data: { deleted: false }, error: { code: 'DELETE_ERROR', message: 'Failed to delete itinerary' } };
    return res.json() as Promise<ApiResponse<{ deleted: boolean }>>;
  },
};
