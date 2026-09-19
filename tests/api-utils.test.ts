/**
 * 🇮🇳 BHARAT SAFE YATRA — API UTILITY TESTS
 * Phase 8 — Backend Unit Tests
 */

import {
  haversineDistance,
  buildPaginationMeta,
  paginate,
  isValidLatitude,
  isValidLongitude,
  sanitizeString,
} from '../src/lib/api/utils';

// ============================================================
// HAVERSINE DISTANCE TESTS
// ============================================================

describe('haversineDistance', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineDistance(34.2268, 77.5876, 34.2268, 77.5876)).toBeCloseTo(0, 1);
  });

  it('calculates correct distance between Leh and Pangong Tso (~107km)', () => {
    // Leh: 34.1526, 77.5771
    // Pangong Tso: 33.7833, 78.6167
    const dist = haversineDistance(34.1526, 77.5771, 33.7833, 78.6167);
    expect(dist).toBeGreaterThan(90);
    expect(dist).toBeLessThan(130);
  });

  it('calculates correct distance from Andaman to Lakshadweep (~2500km)', () => {
    const dist = haversineDistance(11.6234, 92.7265, 10.5593, 72.6358);
    expect(dist).toBeGreaterThan(2000);
    expect(dist).toBeLessThan(3000);
  });

  it('returns positive distance regardless of coordinate order', () => {
    const d1 = haversineDistance(28.6139, 77.2090, 19.0760, 72.8777);
    const d2 = haversineDistance(19.0760, 72.8777, 28.6139, 77.2090);
    expect(d1).toBeCloseTo(d2, 1);
  });
});

// ============================================================
// PAGINATION TESTS
// ============================================================

describe('buildPaginationMeta', () => {
  it('calculates correct totalPages', () => {
    const meta = buildPaginationMeta(1, 10, 25);
    expect(meta.totalPages).toBe(3);
    expect(meta.hasNext).toBe(true);
    expect(meta.hasPrev).toBe(false);
  });

  it('last page has no next', () => {
    const meta = buildPaginationMeta(3, 10, 25);
    expect(meta.hasNext).toBe(false);
    expect(meta.hasPrev).toBe(true);
  });

  it('handles exact division correctly', () => {
    const meta = buildPaginationMeta(2, 10, 20);
    expect(meta.totalPages).toBe(2);
    expect(meta.hasNext).toBe(false);
  });
});

describe('paginate', () => {
  const items = Array.from({ length: 25 }, (_, i) => i + 1);

  it('returns correct slice for page 1', () => {
    const result = paginate(items, 1, 10);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('returns correct slice for page 3', () => {
    const result = paginate(items, 3, 10);
    expect(result).toEqual([21, 22, 23, 24, 25]);
  });

  it('returns empty array for page beyond total', () => {
    const result = paginate(items, 10, 10);
    expect(result).toEqual([]);
  });
});

// ============================================================
// VALIDATION TESTS
// ============================================================

describe('isValidLatitude', () => {
  it('accepts valid latitudes', () => {
    expect(isValidLatitude(0)).toBe(true);
    expect(isValidLatitude(34.2268)).toBe(true);
    expect(isValidLatitude(-89.9)).toBe(true);
    expect(isValidLatitude(90)).toBe(true);
  });

  it('rejects out-of-range latitudes', () => {
    expect(isValidLatitude(90.1)).toBe(false);
    expect(isValidLatitude(-91)).toBe(false);
  });

  it('rejects non-numbers', () => {
    expect(isValidLatitude('28.6')).toBe(false);
    expect(isValidLatitude(null)).toBe(false);
    expect(isValidLatitude(NaN)).toBe(false);
    expect(isValidLatitude(Infinity)).toBe(false);
  });
});

describe('isValidLongitude', () => {
  it('accepts valid longitudes', () => {
    expect(isValidLongitude(0)).toBe(true);
    expect(isValidLongitude(77.2090)).toBe(true);
    expect(isValidLongitude(-180)).toBe(true);
    expect(isValidLongitude(180)).toBe(true);
  });

  it('rejects out-of-range longitudes', () => {
    expect(isValidLongitude(180.1)).toBe(false);
    expect(isValidLongitude(-181)).toBe(false);
  });
});

describe('sanitizeString', () => {
  it('strips SQL injection characters', () => {
    expect(sanitizeString("'; DROP TABLE users; --")).toBe('DROP TABLE users --');
  });

  it('trims whitespace', () => {
    expect(sanitizeString('  Ladakh  ')).toBe('Ladakh');
  });

  it('leaves safe strings unchanged', () => {
    expect(sanitizeString('Pangong Tso')).toBe('Pangong Tso');
  });
});
