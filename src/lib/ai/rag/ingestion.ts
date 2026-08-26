/**
 * 🇮🇳 BHARAT SAFE YATRA — RAG INGESTION & CHUNKING PIPELINE
 * Phase 10: Ingests, cleans, chunks, and attaches metadata to all verified data
 */

import { KnowledgeChunk, KnowledgeDocument } from './types';
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS, VERIFIED_FESTIVALS, VERIFIED_NATIONAL_CONTACTS, VERIFIED_ADVISORIES } from '@/src/lib/fixtures';

export class KnowledgeIngestionPipeline {
  private chunks: KnowledgeChunk[] = [];
  private isInitialized = false;

  public initialize(): KnowledgeChunk[] {
    if (this.isInitialized) return this.chunks;

    const allChunks: KnowledgeChunk[] = [];

    // 1. Ingest Verified Destinations
    for (const dest of VERIFIED_DESTINATIONS) {
      const territorySlug = dest.territoryId.toLowerCase().replace(/_/g, '-');
      const docId = `doc-dest-${dest.id}`;
      const sourceUrl = dest.source?.url || 'https://www.incredibleindia.gov.in';
      const verifiedAt = dest.source?.lastVerified || '2026-08-26';

      // Chunk 1: Overview & Highlights
      allChunks.push({
        id: `chunk-${dest.id}-overview`,
        documentId: docId,
        title: `${dest.name} — Overview & Highlights`,
        content: `Destination: ${dest.name} (${dest.territoryName}). Tagline: ${dest.tagline || ''}. Type: ${dest.type}. Coordinates: ${dest.coordinates?.lat}, ${dest.coordinates?.lng}. Overview: ${dest.overview || dest.shortDescription}. Highlights: ${(dest.highlights || []).join('; ')}. Things to do: ${(dest.thingsToDo || []).map((t) => t.title + ': ' + t.desc).join('; ')}.`,
        territorySlug,
        destinationId: dest.id,
        category: 'DESTINATION',
        sourceUrl,
        sourceType: 'OFFICIAL_TOURISM',
        verificationStatus: 'VERIFIED',
        verifiedAt,
        lastUpdated: verifiedAt,
        keywords: [dest.name.toLowerCase(), dest.territoryName.toLowerCase(), dest.type.toLowerCase(), 'highlights', 'activities'],
      });

      // Chunk 2: Safety, Medical, Emergency & Permits
      const safetyGuidelines = (dest.safety?.guidelines || []).join('. ');
      const permitInfo = dest.permits?.required
        ? `Permits REQUIRED: ${dest.permits.name}. Official portal: ${dest.permits.portal || 'Official UT Portal'}.`
        : `Permits: Not required for standard tourism access. Note: ${dest.permits?.note || 'Standard entry'}.`;

      allChunks.push({
        id: `chunk-${dest.id}-safety-permits`,
        documentId: docId,
        title: `${dest.name} — Safety, Permits & Emergency Protocols`,
        content: `Destination: ${dest.name} (${dest.territoryName}). ${permitInfo} Safety Guidelines: ${safetyGuidelines}. Nearest Emergency Medical Facility: ${dest.safety?.emergencyFacility || 'Dial 112 for statutory emergency response'}. Weather advisory: Best time is ${dest.weather?.bestTime || 'Seasonal'}. Summer temp: ${dest.weather?.tempSummer || 'Moderate'}; Winter temp: ${dest.weather?.tempWinter || 'Cool'}.`,
        territorySlug,
        destinationId: dest.id,
        category: 'PERMIT',
        sourceUrl,
        sourceType: 'PRIMARY_GOVERNMENT',
        verificationStatus: 'VERIFIED',
        verifiedAt,
        lastUpdated: verifiedAt,
        keywords: [dest.name.toLowerCase(), 'permit', 'ilp', 'safety', 'emergency', 'hospital', 'weather', 'best time'],
      });

      // Chunk 3: Gastronomy & Culture
      if (dest.food || dest.culture) {
        allChunks.push({
          id: `chunk-${dest.id}-culture-food`,
          documentId: docId,
          title: `${dest.name} — Culture & Culinary Heritage`,
          content: `Destination: ${dest.name} (${dest.territoryName}). Culinary overview: ${dest.food?.overview || ''}. Specialty dishes: ${(dest.food?.dishes || []).join(', ')}. Languages: ${(dest.culture?.languages || []).join(', ')}. Traditions: ${dest.culture?.traditions || ''}. Etiquette: ${dest.culture?.etiquette || ''}.`,
          territorySlug,
          destinationId: dest.id,
          category: 'CULTURE',
          sourceUrl,
          sourceType: 'OFFICIAL_TOURISM',
          verificationStatus: 'VERIFIED',
          verifiedAt,
          lastUpdated: verifiedAt,
          keywords: [dest.name.toLowerCase(), 'food', 'cuisine', 'dishes', 'culture', 'etiquette', 'languages'],
        });
      }
    }

    // 2. Ingest Verified Union Territories
    for (const ut of VERIFIED_TERRITORIES) {
      const advText = (ut.advisories || []).join('. ');
      const expText = (ut.signatureExperiences || ut.highlights || []).join(', ');
      const popText = (ut.popularDestinations || []).join(', ');
      const sourceUrl = ut.slug === 'lakshadweep' ? 'https://epermit.utl.gov.in' : ut.officialPortal || 'https://tourism.gov.in';

      allChunks.push({
        id: `chunk-ut-${ut.id}`,
        documentId: `doc-ut-${ut.id}`,
        title: `${ut.name} — UT Profile, Entry Regulations & ePermit Guidelines`,
        content: `Union Territory: ${ut.name} (Code: ${ut.code}, Capital: ${ut.capital}). Tagline: ${ut.tagline || ''}. Signature Experiences: ${expText}. Popular destinations: ${popText}. Official Advisories & Entry Rules: ${advText}. Official Portal: ${ut.officialPortal}. ePermit Portal: ${ut.slug === 'lakshadweep' ? 'https://epermit.utl.gov.in' : 'Official UT Permit Desk'}. Emergency numbers: Unified 112, Tourist Helpline 1363.`,
        territorySlug: ut.slug,
        category: 'TERRITORY',
        sourceUrl,
        sourceType: 'PRIMARY_GOVERNMENT',
        verificationStatus: 'VERIFIED',
        verifiedAt: '2026-08-26',
        lastUpdated: '2026-08-26',
        keywords: [ut.name.toLowerCase(), ut.capital.toLowerCase(), ut.slug, 'territory', 'capital', 'portal', 'permit', 'epermit', 'entry'],
      });
    }

    // 3. Ingest Cultural Festivals 2026
    for (const fest of VERIFIED_FESTIVALS) {
      const territorySlug = fest.territoryId?.toLowerCase().replace(/_/g, '-') || 'general';
      const sourceUrl = fest.officialSource?.url || 'https://utsav.gov.in';
      allChunks.push({
        id: `chunk-fest-${fest.id}`,
        documentId: `doc-fest-${fest.id}`,
        title: `${fest.name} (${fest.territoryName}) — 2026 Cultural Festival`,
        content: `Cultural Festival: ${fest.name} in ${fest.territoryName}. Display Date: ${fest.displayDate}. Date Precision: ${fest.datePrecision || 'EXACT_CONFIRMED'}. Description: ${fest.description}. Cultural Significance: ${fest.culturalSignificance || 'Traditional cultural celebration'}. Verified Official Source: ${fest.officialSource?.name || 'Ministry of Tourism Utsav Portal'}.`,
        territorySlug,
        category: 'FESTIVAL',
        sourceUrl,
        sourceType: 'OFFICIAL_TOURISM',
        verificationStatus: 'VERIFIED',
        verifiedAt: '2026-08-26',
        lastUpdated: '2026-08-26',
        keywords: [fest.name.toLowerCase(), fest.territoryName.toLowerCase(), 'festival', 'celebration', 'events', 'date', '2026'],
      });
    }

    // 4. Ingest Safety Advisories & Emergency Protocols
    allChunks.push({
      id: 'chunk-emergency-national',
      documentId: 'doc-emergency-national',
      title: 'National Emergency Response Protocols & Helplines (24x7)',
      content: `National Emergency Helplines across all 8 Union Territories: ${VERIFIED_NATIONAL_CONTACTS.map((c) => `${c.service}: ${c.number} (${c.description})`).join('; ')}. Immediate Life Safety: Always dial 112 for unified multi-agency emergency dispatch. Maritime Search & Rescue (ICG): Dial 1554. Tourist Helpline: Dial 1363 (24x7 multi-lingual guidance).`,
      category: 'SAFETY',
      sourceUrl: 'https://112.gov.in',
      sourceType: 'PRIMARY_GOVERNMENT',
      verificationStatus: 'VERIFIED',
      verifiedAt: '2026-08-26',
      lastUpdated: '2026-08-26',
      keywords: ['emergency', 'helpline', '112', '1363', '1554', 'police', 'ambulance', 'fire', 'coast guard', 'sos'],
    });

    this.chunks = allChunks;
    this.isInitialized = true;
    return this.chunks;
  }

  public getChunks(): KnowledgeChunk[] {
    if (!this.isInitialized) {
      return this.initialize();
    }
    return this.chunks;
  }
}

export const knowledgeIngestion = new KnowledgeIngestionPipeline();
