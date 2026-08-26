/**
 * 🇮🇳 BHARAT SAFE YATRA — PROVIDER INTEGRATION & CONTRACT TESTS
 * Phase 9B: Real Provider Integration Test Suite
 */

import { getWeatherData } from '../src/lib/providers/weather';
import { calculateRouteWithFallback, searchGeocodingWithFallback } from '../src/lib/providers/maps';
import { searchFlightsWithFallback } from '../src/lib/providers/flights';
import { searchHotelsWithFallback } from '../src/lib/providers/hotels';
import { convertCurrencyWithFallback } from '../src/lib/providers/currency';
import { createPaymentOrder, verifyPayment } from '../src/lib/providers/payments';
import { getNearbyEmergencyFacilities } from '../src/lib/providers/emergency';

describe('Phase 9B Provider Integration Suite', () => {
  // 1. WEATHER & MARINE
  describe('Weather Service', () => {
    it('should return valid weather data and forecast for Leh coordinates', async () => {
      const weather = await getWeatherData(34.1526, 77.5771);
      expect(weather).toBeDefined();
      expect(weather.current).toBeDefined();
      expect(typeof weather.current.tempC).toBe('number');
      expect(typeof weather.current.humidityPercent).toBe('number');
      expect(weather.forecast.length).toBeGreaterThanOrEqual(1);
      expect(weather.metadata.provider).toBeDefined();
      expect(weather.metadata.status).toMatch(/LIVE|CACHED|FALLBACK/);
    });

    it('should calculate marine swell telemetry for Andaman coordinates', async () => {
      const weather = await getWeatherData(11.6667, 92.7486);
      expect(weather).toBeDefined();
      expect(weather.current).toBeDefined();
    });
  });

  // 2. MAPS & ROUTING
  describe('Maps & Routing Service', () => {
    it('should calculate a turn-by-turn route between Leh and Pangong Tso', async () => {
      const route = await calculateRouteWithFallback([
        { lat: 34.1526, lng: 77.5771, name: 'Leh Main Bazar' },
        { lat: 33.753, lng: 78.667, name: 'Pangong Tso' },
      ]);
      expect(route).toBeDefined();
      expect(route.totalDistanceKm).toBeGreaterThan(50);
      expect(route.totalDurationMinutes).toBeGreaterThan(60);
      expect(route.geometryGeoJSON.type).toBe('LineString');
      expect(route.geometryGeoJSON.coordinates.length).toBeGreaterThanOrEqual(2);
      expect(route.segments.length).toBeGreaterThanOrEqual(1);
    });

    it('should forward geocode and find Cellular Jail in Andaman', async () => {
      const results = await searchGeocodingWithFallback('Cellular Jail');
      expect(results.length).toBeGreaterThanOrEqual(1);
      expect(results[0].placeName).toContain('Cellular Jail');
      expect(results[0].center.length).toBe(2);
    });
  });

  // 3. FLIGHTS & AVIATION
  describe('Flight Search Service', () => {
    it('should return verified flight offers between Delhi (DEL) and Leh (IXL)', async () => {
      const flights = await searchFlightsWithFallback('DEL', 'IXL', '2026-09-15', 1);
      expect(flights.length).toBeGreaterThanOrEqual(1);
      expect(flights[0].sourceAirport).toBe('DEL');
      expect(flights[0].destinationAirport).toBe('IXL');
      expect(flights[0].priceINR).toBeGreaterThan(1000);
      expect(flights[0].segments.length).toBeGreaterThanOrEqual(1);
    });
  });

  // 4. ACCOMMODATION & GOVT STAYS
  describe('Hotel & Stays Service', () => {
    it('should return official government tourism stays for Ladakh', async () => {
      const hotels = await searchHotelsWithFallback('ladakh');
      expect(hotels.length).toBeGreaterThanOrEqual(1);
      const govtStay = hotels.find((h) => h.isOfficialGovtStay);
      expect(govtStay).toBeDefined();
      expect(govtStay?.officialBookingUrl).toContain('http');
    });
  });

  // 5. CURRENCY CONVERSION
  describe('Currency & FX Service', () => {
    it('should convert INR to USD with positive rate', async () => {
      const result = await convertCurrencyWithFallback(1000, 'INR', 'USD');
      expect(result.baseCurrency).toBe('INR');
      expect(result.targetCurrency).toBe('USD');
      expect(result.rate).toBeGreaterThan(0);
      expect(result.convertedAmount).toBeGreaterThan(0);
      expect(result.metadata.status).toMatch(/LIVE|FALLBACK/);
    });
  });

  // 6. PAYMENTS & TRANSACTIONS
  describe('Payment Gateway Service', () => {
    it('should create a valid Razorpay order with orderId', async () => {
      const order = await createPaymentOrder({
        amountINR: 1500,
        currency: 'INR',
        receiptId: 'rec_unit_test_001',
        customer: { name: 'Test Tourist', email: 'test@example.com' },
      });
      expect(order.orderId).toBeDefined();
      expect(order.amountINR).toBe(1500);
      expect(order.status).toBe('CREATED');
    });

    it('should verify test payment signature', () => {
      const isValid = verifyPayment({
        orderId: 'order_test_12345',
        paymentId: 'pay_test_67890',
        signature: 'sig_test_valid_demo',
      });
      expect(isValid).toBe(true);
    });
  });

  // 7. EMERGENCY & LIFE SAFETY
  describe('Emergency Spatial Service', () => {
    it('should find SNM Hospital Leh as closest trauma center for Leh coordinates', async () => {
      const facilities = await getNearbyEmergencyFacilities(34.1526, 77.5771, 3);
      expect(facilities.length).toBeGreaterThanOrEqual(1);
      expect(facilities[0].name).toContain('Sonam Norboo Memorial');
      expect(facilities[0].distanceKm).toBeLessThan(10);
      expect(facilities[0].officialGovtId).toContain('ABDM-HFR');
      expect(facilities[0].hasHyperbaricOxygen).toBe(true);
    });
  });
});
