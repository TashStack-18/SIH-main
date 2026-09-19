/**
 * 🇮🇳 BHARAT SAFE YATRA — JWT AUTHENTICATION UTILITIES
 * Phase 8 — Backend Implementation
 *
 * Security design:
 * - Tokens are signed with HS256 using a server-side secret.
 * - Tokens are short-lived (access: 1h, refresh: 7d).
 * - Passwords are never stored or logged in plaintext.
 * - No PII is included in JWT payload beyond user ID and role.
 */

import { NextRequest } from 'next/server';

// ============================================================
// TOKEN TYPES
// ============================================================

export interface JWTPayload {
  sub: string;   // User ID (UUID)
  role: 'USER' | 'ADMIN' | 'CONTENT_MANAGER' | 'SAFETY_MANAGER';
  iat: number;   // Issued at
  exp: number;   // Expiry
}

export interface AuthUser {
  id: string;
  role: JWTPayload['role'];
}

// ============================================================
// CONFIGURATION
// ============================================================

const JWT_SECRET = process.env.JWT_SECRET ?? 'bharat-safe-yatra-dev-secret-change-in-production';
const ACCESS_TOKEN_TTL_SECONDS = 60 * 60;       // 1 hour
const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

// ============================================================
// JWT IMPLEMENTATION (Native Web Crypto — no external package needed)
// ============================================================

function base64url(input: string | ArrayBuffer): string {
  const bytes = typeof input === 'string'
    ? new TextEncoder().encode(input)
    : new Uint8Array(input);
  let str = '';
  bytes.forEach(b => { str += String.fromCharCode(b); });
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64urlDecode(str: string): string {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const padding = (4 - (padded.length % 4)) % 4;
  return atob(padded + '='.repeat(padding));
}

async function getKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signJWT(payload: Omit<JWTPayload, 'iat' | 'exp'>, ttlSeconds: number): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: JWTPayload = { ...payload, iat: now, exp: now + ttlSeconds };
  const header = base64url(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = base64url(JSON.stringify(fullPayload));
  const data = `${header}.${body}`;
  const key = await getKey(JWT_SECRET);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${base64url(sig)}`;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    const data = `${header}.${body}`;
    const key = await getKey(JWT_SECRET);
    const sigBytes = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
    const valid = await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(data));
    if (!valid) return null;
    const payload: JWTPayload = JSON.parse(base64urlDecode(body));
    if (payload.exp < Math.floor(Date.now() / 1000)) return null; // Expired
    return payload;
  } catch {
    return null;
  }
}

export async function createAccessToken(userId: string, role: JWTPayload['role']): Promise<string> {
  return signJWT({ sub: userId, role }, ACCESS_TOKEN_TTL_SECONDS);
}

export async function createRefreshToken(userId: string, role: JWTPayload['role']): Promise<string> {
  return signJWT({ sub: userId, role }, REFRESH_TOKEN_TTL_SECONDS);
}

// ============================================================
// REQUEST EXTRACTION
// ============================================================

/**
 * Extract and verify the Bearer token from the Authorization header.
 * Returns the authenticated user payload or null.
 */
export async function getAuthUser(req: NextRequest): Promise<AuthUser | null> {
  const authHeader = req.headers.get('Authorization') ?? req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7);
  const payload = await verifyJWT(token);
  if (!payload) return null;
  return { id: payload.sub, role: payload.role };
}

/**
 * Require authentication — throws a 401 response shape if not authenticated.
 * Use this in protected route handlers.
 */
export async function requireAuth(req: NextRequest): Promise<AuthUser> {
  const user = await getAuthUser(req);
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  return user;
}

/**
 * Require a specific role — throws 403 if the user doesn't have sufficient privileges.
 */
export async function requireRole(
  req: NextRequest,
  allowedRoles: JWTPayload['role'][]
): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  return user;
}

// ============================================================
// PASSWORD HASHING (bcrypt-compatible PBKDF2 — no external deps)
// ============================================================

/**
 * Hash a password using PBKDF2-SHA256 with a random 16-byte salt.
 * Returns "pbkdf2:iterations:salt:hash" format.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const iterations = 100_000;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2:${iterations}:${saltHex}:${hashHex}`;
}

/**
 * Verify a plaintext password against a stored hash.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [, iterStr, saltHex, expectedHash] = stored.split(':');
    const iterations = parseInt(iterStr, 10);
    const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']);
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      keyMaterial,
      256
    );
    const hashHex = Array.from(new Uint8Array(derived)).map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === expectedHash;
  } catch {
    return false;
  }
}
