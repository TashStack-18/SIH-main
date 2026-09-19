/**
 * 🇮🇳 BHARAT SAFE YATRA — BOOKING PROVIDER ADAPTER (Client-side)
 * Contract: GET /api/v1/bookings/providers, GET /api/v1/bookings/experiences
 *
 * ARCHITECTURE NOTE (Phase 8):
 * Bharat Safe Yatra is a tourism INFORMATION platform, not a booking engine.
 * The booking integration is a REDIRECT ADAPTER pattern:
 *   1. We list verified government and official providers.
 *   2. The user is redirected to the provider's official URL to book.
 *   3. We do NOT process payments or store booking confirmations.
 *   4. getUserBookings() returns an empty array until a provider webhook is implemented.
 *
 * This is the correct design per Phase 1 PRD §12 ("Provider Adapter").
 * Do NOT invent booking confirmation records.
 */

import type { ApiResponse, BookableExperience, BookingProvider, UserBooking } from '../types';
import { VERIFIED_BOOKABLE_EXPERIENCES, VERIFIED_BOOKING_PROVIDERS } from '../lib/fixtures';

export const bookingService = {
  async getProviders(): Promise<ApiResponse<BookingProvider[]>> {
    return {
      success: true,
      data: VERIFIED_BOOKING_PROVIDERS,
      meta: {
        lastUpdated: '2026-08-26',
        note: 'Provider redirects to official government booking portals. Bharat Safe Yatra does not process payments.',
      },
    };
  },

  async getBookableExperiences(category: string = 'ALL'): Promise<ApiResponse<BookableExperience[]>> {
    let result = [...VERIFIED_BOOKABLE_EXPERIENCES];
    if (category !== 'ALL') {
      result = result.filter(e => e.category === category);
    }
    return {
      success: true,
      data: result,
      meta: {
        total: result.length,
        lastUpdated: '2026-08-26',
      },
    };
  },

  /**
   * Returns user bookings.
   * Currently returns empty array — booking webhook integration is Phase 9+.
   * When providers implement booking webhooks, this will be populated from the database.
   * Do NOT fake booking records.
   */
  async getUserBookings(): Promise<ApiResponse<UserBooking[]>> {
    return {
      success: true,
      data: [],
      meta: {
        note: 'Booking history from external providers requires webhook integration (Phase 9).',
      },
    };
  },
};
