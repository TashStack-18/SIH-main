/**
 * 🇮🇳 BHARAT SAFE YATRA — REALTIME JOURNEY EVENTS
 * Phase 11: Realtime Journey Progress & Route Recalculation Events
 *
 * Reuses the SOS/Realtime channel architecture with dedicated 'journey' namespace:
 * - journey.stop.active
 * - journey.stop.completed
 * - journey.route.recalculated
 */

export interface JourneyEventPayload {
  itineraryId: string;
  timestamp: string;
  eventType: 'STOP_ACTIVE' | 'STOP_COMPLETED' | 'ROUTE_RECALCULATED' | 'OFF_ROUTE_WARNING';
  stopId?: string;
  stopName?: string;
  completedStops?: number;
  totalStops?: number;
  progressPercentage?: number;
  routeGeometry?: unknown;
}

export class JourneyRealtimeBus {
  private static listeners: Array<(event: JourneyEventPayload) => void> = [];

  public static emitJourneyEvent(payload: Omit<JourneyEventPayload, 'timestamp'>): void {
    const fullPayload: JourneyEventPayload = {
      ...payload,
      timestamp: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('bsy:journey:event', {
          detail: fullPayload,
        })
      );
    }

    this.listeners.forEach((listener) => {
      try {
        listener(fullPayload);
      } catch (err) {
        console.warn('[JourneyRealtimeBus] Listener error:', err);
      }
    });
  }

  public static subscribe(listener: (event: JourneyEventPayload) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}
