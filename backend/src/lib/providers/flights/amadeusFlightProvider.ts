/**
 * 🇮🇳 BHARAT SAFE YATRA — AMADEUS FLIGHT PROVIDER (PRIMARY)
 * Phase 9B: Real Amadeus Flight Offers Search v2 Integration
 */

import { IFlightProvider, FlightOffer } from '../types';

export class AmadeusFlightProvider implements IFlightProvider {
  name = 'Amadeus';
  private cachedToken: { token: string; expiresAt: number } | null = null;

  private async getOAuthToken(): Promise<string | null> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt - 60000) {
      return this.cachedToken.token;
    }

    const clientId = process.env.AMADEUS_CLIENT_ID;
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

    if (!clientId || !clientSecret || clientId.includes('your_') || clientSecret.includes('your_')) {
      return null;
    }

    try {
      const res = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: clientId,
          client_secret: clientSecret,
        }),
      });

      if (!res.ok) {
        console.warn(`[Amadeus OAuth] Token request failed with HTTP ${res.status}`);
        return null;
      }

      const json = (await res.json()) as { access_token: string; expires_in: number };
      this.cachedToken = {
        token: json.access_token,
        expiresAt: Date.now() + json.expires_in * 1000,
      };

      return this.cachedToken.token;
    } catch (err) {
      console.error('[Amadeus OAuth] Error retrieving token:', err);
      return null;
    }
  }

  async searchFlights(
    origin: string,
    destination: string,
    departureDate: string,
    adults = 1
  ): Promise<FlightOffer[] | null> {
    const token = await this.getOAuthToken();
    if (!token) return null;

    const startTime = Date.now();

    try {
      const url = `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin.toUpperCase()}&destinationLocationCode=${destination.toUpperCase()}&departureDate=${departureDate}&adults=${adults}&currencyCode=INR&max=10`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 1800 },
      });

      if (!res.ok) {
        console.warn(`[Amadeus Flight Offers] HTTP ${res.status}`);
        return null;
      }

      const json = (await res.json()) as {
        data?: Array<{
          id: string;
          price: { total: string; currency: string };
          itineraries: Array<{
            duration: string;
            segments: Array<{
              carrierCode: string;
              number: string;
              departure: { iataCode: string; at: string };
              arrival: { iataCode: string; at: string };
              duration: string;
            }>;
          }>;
        }>;
      };

      if (!json.data || json.data.length === 0) return null;

      const airlineNames: Record<string, string> = {
        AI: 'Air India',
        '6E': 'IndiGo',
        SG: 'SpiceJet',
        UK: 'Vistara',
        I5: 'Air India Express',
        '9I': 'Alliance Air',
      };

      return json.data.map((offer) => {
        const itinerary = offer.itineraries[0];
        const segments = itinerary.segments.map((seg) => ({
          airlineCode: seg.carrierCode,
          airlineName: airlineNames[seg.carrierCode] || seg.carrierCode,
          flightNumber: `${seg.carrierCode}-${seg.number}`,
          departureAirport: seg.departure.iataCode,
          departureCity: seg.departure.iataCode,
          departureTime: seg.departure.at,
          arrivalAirport: seg.arrival.iataCode,
          arrivalCity: seg.arrival.iataCode,
          arrivalTime: seg.arrival.at,
          durationMinutes: this.parseIsoDuration(seg.duration),
        }));

        return {
          id: `amadeus-${offer.id}`,
          provider: 'Amadeus Self-Service GDS',
          sourceAirport: origin.toUpperCase(),
          destinationAirport: destination.toUpperCase(),
          departureDate,
          priceINR: Math.round(parseFloat(offer.price.total)),
          currency: 'INR',
          cabinClass: 'ECONOMY',
          stopsCount: segments.length - 1,
          segments,
          bookingDeepLink: `https://www.google.com/travel/flights?q=Flights%20to%20${destination}%20from%20${origin}%20on%20${departureDate}`,
          metadata: {
            provider: 'Amadeus for Developers',
            source: 'Amadeus Global Distribution System (GDS)',
            retrievedAt: new Date().toISOString(),
            status: 'LIVE',
            isLive: true,
            latencyMs: Date.now() - startTime,
          },
        };
      });
    } catch (err) {
      console.warn('[AmadeusFlightProvider] Search error:', err);
      return null;
    }
  }

  private parseIsoDuration(duration: string): number {
    const hoursMatch = duration.match(/(\d+)H/);
    const minsMatch = duration.match(/(\d+)M/);
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const mins = minsMatch ? parseInt(minsMatch[1], 10) : 0;
    return hours * 60 + mins;
  }
}
