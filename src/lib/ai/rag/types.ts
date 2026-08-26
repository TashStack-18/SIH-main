/**
 * 🇮🇳 BHARAT SAFE YATRA — RAG KNOWLEDGE BASE TYPES
 * Phase 10: Retrieval-Augmented Generation Architecture
 */

import { SourcePriority, VerificationStatus, SourceCitation } from '../types';

export interface KnowledgeDocument {
  id: string;
  title: string;
  sourceUrl: string;
  sourceType: SourcePriority;
  territorySlug?: string;
  destinationId?: string;
  category: 'DESTINATION' | 'TERRITORY' | 'PERMIT' | 'SAFETY' | 'FESTIVAL' | 'FOOD' | 'CULTURE' | 'STAY' | 'TRANSPORT';
  verificationStatus: VerificationStatus;
  verifiedAt: string;
  lastUpdated: string;
  expiresAt?: string;
  rawText: string;
}

export interface KnowledgeChunk {
  id: string;
  documentId: string;
  title: string;
  content: string;
  territorySlug?: string;
  destinationId?: string;
  category: string;
  sourceUrl: string;
  sourceType: SourcePriority;
  verificationStatus: VerificationStatus;
  verifiedAt: string;
  lastUpdated: string;
  embedding?: number[];
  keywords: string[];
}

export interface RAGFilter {
  territorySlug?: string;
  destinationId?: string;
  category?: string;
  minSourcePriority?: SourcePriority;
  requireVerifiedOnly?: boolean;
}

export interface RAGSearchResult {
  chunk: KnowledgeChunk;
  score: number; // Relevance score (0.0 to 1.0)
  matchType: 'VECTOR_SEMANTIC' | 'KEYWORD_BM25' | 'METADATA_FILTER' | 'HYBRID';
  citation: SourceCitation;
}

export interface RAGContext {
  formattedContext: string;
  citations: SourceCitation[];
  chunks: KnowledgeChunk[];
  totalRetrieved: number;
}
