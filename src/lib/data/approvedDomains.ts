/**
 * 🇮🇳 BHARAT SAFE YATRA — APPROVED BOOKING REDIRECT DOMAINS
 * Phase 5.2: Booking Redirect Security
 *
 * Only domains in this allowlist may be used as booking redirect targets.
 * Arbitrary user-provided URLs are REJECTED.
 */

const APPROVED_DOMAINS: ReadonlySet<string> = new Set([
  // Government Tourism Portals (8 UTs)
  'tourism.andamannicobar.gov.in',
  'chandigarhtourism.gov.in',
  'ddd.gov.in',
  'delhitourism.gov.in',
  'www.jktdc.co.in',
  'jktdc.co.in',
  'tourism.ladakh.gov.in',
  'lakshadweep.gov.in',
  'epermit.utl.gov.in',
  'tourism.py.gov.in',
  'lahdclehpermit.in',

  // Central Government
  'asi.payumoney.com',        // ASI monument tickets
  'indianrailways.gov.in',
  'irctc.co.in',
  'www.irctc.co.in',
  'airindia.com',
  'www.airindia.com',

  // Official Transport Operators
  'ship.andamannicobar.gov.in',   // A&N shipping
  'andamanship.in',               // A&N shipping alternative
  'lakshadweepship.in',           // Lakshadweep ship bookings

  // Verified Commercial Providers (major, legitimate)
  'www.makemytrip.com',
  'www.goibibo.com',
  'www.yatra.com',
  'www.cleartrip.com',
  'www.booking.com',
  'www.agoda.com',
  'www.abhibus.com',
  'www.redbus.in',

  // State Tourism Corporations
  'www.aniidco.and.nic.in',      // ANIIDCO Andaman
  'sportstourism.in',             // Lakshadweep SPORTS
]);

/**
 * Validate whether a booking redirect URL points to an approved domain.
 * Returns the validated URL if safe, or null if the domain is not allowed.
 */
export function validateBookingRedirect(url: string): { isValid: boolean; domain: string; reason?: string } {
  try {
    const parsed = new URL(url);

    // Must be HTTPS (with exception for localhost in dev)
    if (parsed.protocol !== 'https:' && parsed.hostname !== 'localhost') {
      return { isValid: false, domain: parsed.hostname, reason: 'URL must use HTTPS protocol' };
    }

    // Check domain against allowlist
    const domain = parsed.hostname.toLowerCase();
    if (APPROVED_DOMAINS.has(domain)) {
      return { isValid: true, domain };
    }

    // Check if it's a subdomain of an approved domain
    for (const approved of Array.from(APPROVED_DOMAINS)) {
      if (domain.endsWith(`.${approved}`)) {
        return { isValid: true, domain };
      }
    }

    return { isValid: false, domain, reason: `Domain "${domain}" is not in the approved booking redirect allowlist` };
  } catch {
    return { isValid: false, domain: 'INVALID_URL', reason: 'Malformed URL' };
  }
}

/**
 * Check if a domain is in the trusted government category (no redirect warning needed).
 */
export function isTrustedGovernmentDomain(url: string): boolean {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    return domain.endsWith('.gov.in') || domain.endsWith('.nic.in');
  } catch {
    return false;
  }
}

export { APPROVED_DOMAINS };
