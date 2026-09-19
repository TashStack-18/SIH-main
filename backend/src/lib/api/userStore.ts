/**
 * 🇮🇳 BHARAT SAFE YATRA — IN-MEMORY USER STORE
 * Phase 8 — Backend Implementation
 *
 * This is the data access layer for user accounts.
 * When PostgreSQL + Prisma is connected, replace this module's functions
 * with database calls. The API routes are agnostic to this layer.
 *
 * NOTE: In-process Map resets on server restart.
 * For production, connect to PostgreSQL with the Prisma adapter.
 */

import { hashPassword } from './auth';

// ============================================================
// USER ENTITY
// ============================================================

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  phone?: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN' | 'CONTENT_MANAGER' | 'SAFETY_MANAGER';
  savedDestinationIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// IN-MEMORY STORE
// ============================================================

// Global store persisted for the lifetime of the Node.js process
const userStore = new Map<string, UserRecord>();
let userIdCounter = 1;

function generateUserId(): string {
  return `usr-${Date.now()}-${(userIdCounter++).toString().padStart(4, '0')}`;
}

// ============================================================
// USER OPERATIONS
// ============================================================

export async function createUser(
  email: string,
  name: string,
  password: string,
  role: UserRecord['role'] = 'USER'
): Promise<Omit<UserRecord, 'passwordHash'>> {
  const existingByEmail = findUserByEmail(email);
  if (existingByEmail) {
    throw new Error('EMAIL_ALREADY_EXISTS');
  }

  const id = generateUserId();
  const now = new Date().toISOString();
  const record: UserRecord = {
    id,
    email: email.toLowerCase().trim(),
    name: name.trim(),
    role,
    passwordHash: await hashPassword(password),
    savedDestinationIds: [],
    createdAt: now,
    updatedAt: now,
  };
  userStore.set(id, record);
  // Also index by email for fast lookup
  userStore.set(`email:${email.toLowerCase()}`, record);
  return sanitizeUser(record);
}

export function findUserById(id: string): UserRecord | undefined {
  return userStore.get(id);
}

export function findUserByEmail(email: string): UserRecord | undefined {
  return userStore.get(`email:${email.toLowerCase()}`);
}

export function updateUser(
  id: string,
  updates: Partial<Pick<UserRecord, 'name' | 'phone' | 'savedDestinationIds'>>
): Omit<UserRecord, 'passwordHash'> | null {
  const user = userStore.get(id);
  if (!user) return null;
  const updated: UserRecord = { ...user, ...updates, updatedAt: new Date().toISOString() };
  userStore.set(id, updated);
  userStore.set(`email:${user.email}`, updated);
  return sanitizeUser(updated);
}

export function addSavedDestination(userId: string, destinationId: string): boolean {
  const user = userStore.get(userId);
  if (!user) return false;
  if (user.savedDestinationIds.includes(destinationId)) return true; // Already saved
  updateUser(userId, { savedDestinationIds: [...user.savedDestinationIds, destinationId] });
  return true;
}

export function removeSavedDestination(userId: string, destinationId: string): boolean {
  const user = userStore.get(userId);
  if (!user) return false;
  updateUser(userId, {
    savedDestinationIds: user.savedDestinationIds.filter(id => id !== destinationId),
  });
  return true;
}

/** Strip password hash from user record before returning to caller */
export function sanitizeUser(user: UserRecord): Omit<UserRecord, 'passwordHash'> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _, ...safe } = user;
  return safe;
}
