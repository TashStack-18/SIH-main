/**
 * 🇮🇳 BHARAT SAFE YATRA — AI SERVICE (Client-side)
 * Calls: POST /api/v1/ai/chat, POST /api/v1/ai/itinerary
 *
 * Client wrapper — all AI processing happens server-side.
 * The OpenAI API key is NEVER exposed to the browser.
 */

import type { ApiResponse, AIMessage, Itinerary } from '../types';

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export const aiService = {
  async sendMessage(
    userText: string,
    conversationHistory: Array<{ role: string; content: string }> = [],
    context: Record<string, unknown> = {}
  ): Promise<ApiResponse<AIMessage>> {
    const res = await fetch(`${BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userText, conversationHistory, context }),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
      return {
        success: false,
        data: null as unknown as AIMessage,
        error: {
          code: 'AI_ERROR',
          message: err.error?.message ?? 'Yatra AI is temporarily unavailable.',
        },
      };
    }
    return res.json() as Promise<ApiResponse<AIMessage>>;
  },

  async generateItinerary(params: {
    territoryId: string;
    durationDays: number;
    travellers: number;
    travelStyle: string;
    interests?: string[];
    budget?: number;
  }): Promise<ApiResponse<{ proposal: Partial<Itinerary>; confirmationRequired: boolean }>> {
    const res = await fetch(`${BASE}/ai/itinerary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: { message?: string } };
      return {
        success: false,
        data: null as unknown as { proposal: Partial<Itinerary>; confirmationRequired: boolean },
        error: {
          code: 'AI_ITINERARY_ERROR',
          message: err.error?.message ?? 'Itinerary generation failed.',
        },
      };
    }
    return res.json() as Promise<ApiResponse<{ proposal: Partial<Itinerary>; confirmationRequired: boolean }>>;
  },
};
