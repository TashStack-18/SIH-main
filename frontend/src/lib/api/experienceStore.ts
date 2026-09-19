/**
 * 🇮🇳 BHARAT SAFE YATRA — IN-MEMORY EXPERIENCE STORE
 *
 * This is the data access layer for user travel experiences.
 * Since no persistent database exists yet, this uses an in-memory Map
 * that resets on server restart.
 */

export interface ExperienceRecord {
  id: string;
  userId: string;
  destinationId: string;
  rating: number; // 1 to 5
  text: string;
  photos: string[]; // Mock URLs (object URLs or data URIs)
  status: 'PENDING' | 'PUBLISHED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

const experienceStore = new Map<string, ExperienceRecord>();
let expIdCounter = 1;

function generateExpId(): string {
  return `exp-${Date.now()}-${(expIdCounter++).toString().padStart(4, '0')}`;
}

export function createExperience(data: Omit<ExperienceRecord, 'id' | 'createdAt' | 'updatedAt' | 'status'>): ExperienceRecord {
  const id = generateExpId();
  const now = new Date().toISOString();
  
  const record: ExperienceRecord = {
    ...data,
    id,
    status: 'PUBLISHED', // Auto-publish for the mock
    createdAt: now,
    updatedAt: now,
  };
  
  experienceStore.set(id, record);
  return record;
}

export function getExperienceById(id: string): ExperienceRecord | undefined {
  return experienceStore.get(id);
}

export function getExperiencesByDestination(destinationId: string): ExperienceRecord[] {
  const results: ExperienceRecord[] = [];
  for (const exp of experienceStore.values()) {
    if (exp.destinationId === destinationId && exp.status === 'PUBLISHED') {
      results.push(exp);
    }
  }
  // Sort descending by createdAt
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAllExperiences(): ExperienceRecord[] {
  const results: ExperienceRecord[] = [];
  for (const exp of experienceStore.values()) {
    if (exp.status === 'PUBLISHED') {
      results.push(exp);
    }
  }
  return results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
