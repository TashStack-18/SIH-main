/**
 * 🇮🇳 BHARAT SAFE YATRA — RAG HYBRID RETRIEVAL ENGINE
 * Phase 10: Metadata Filtering + BM25 Keyword Scoring + Territory Disambiguation
 */

import { KnowledgeChunk, RAGFilter, RAGSearchResult } from './types';
import { knowledgeIngestion } from './ingestion';

export class HybridRetrievalEngine {
  private stopWords = new Set([
    'a', 'an', 'the', 'is', 'in', 'at', 'of', 'on', 'for', 'to', 'and', 'or', 'with', 'by',
    'what', 'how', 'when', 'where', 'which', 'who', 'why', 'can', 'i', 'you', 'my', 'me', 'do',
    'does', 'tell', 'about', 'show', 'give', 'please', 'know', 'want', 'need',
  ]);

  private territoryKeywords: Record<string, string[]> = {
    'ladakh': ['ladakh', 'leh', 'nubra', 'pangong', 'kargil', 'changthang', 'zanskar'],
    'andaman-nicobar': ['andaman', 'nicobar', 'port blair', 'havelock', 'swaraj dweep', 'radhanagar', 'cellular jail'],
    'lakshadweep': ['lakshadweep', 'agatti', 'bangaram', 'kavaratti', 'kadmat', 'minicoy'],
    'jammu-kashmir': ['kashmir', 'jammu', 'srinagar', 'gulmarg', 'pahalgam', 'dal lake'],
    'delhi': ['delhi', 'red fort', 'qutub', 'humayun', 'chandni chowk'],
    'puducherry': ['puducherry', 'pondicherry', 'auroville', 'white town', 'promenade'],
    'chandigarh': ['chandigarh', 'rock garden', 'sukhna', 'corbusier', 'capitol complex'],
    'dnh-dd': ['daman', 'diu', 'dadra', 'silvassa', 'nagar haveli'],
  };

  public search(query: string, filter?: RAGFilter, topK = 6): RAGSearchResult[] {
    const chunks = knowledgeIngestion.getChunks();
    const queryTokens = this.tokenize(query);
    const queryLower = query.toLowerCase();

    // Detect if query specifies a particular territory
    let detectedTerritory: string | null = null;
    for (const [slug, keywords] of Object.entries(this.territoryKeywords)) {
      if (keywords.some((kw) => queryLower.includes(kw))) {
        detectedTerritory = slug;
        break;
      }
    }

    const scoredResults: RAGSearchResult[] = [];

    for (const chunk of chunks) {
      // 1. Metadata Filtering
      const targetTerritory = filter?.territorySlug || detectedTerritory;
      if (targetTerritory && chunk.territorySlug && chunk.territorySlug !== targetTerritory) {
        // If query explicitly mentions a territory, skip chunks belonging to unrelated territories
        continue;
      }
      if (filter?.destinationId && chunk.destinationId && chunk.destinationId !== filter.destinationId) {
        continue;
      }
      if (filter?.category && chunk.category !== filter.category) {
        continue;
      }
      if (filter?.requireVerifiedOnly && chunk.verificationStatus !== 'VERIFIED') {
        continue;
      }

      // 2. Token Matching & Scoring
      const chunkTokens = this.tokenize(chunk.title + ' ' + chunk.content + ' ' + chunk.keywords.join(' '));
      let matchCount = 0;
      let exactTitleMatch = false;

      for (const qToken of queryTokens) {
        if (chunk.title.toLowerCase().includes(qToken)) {
          exactTitleMatch = true;
          matchCount += 4;
        } else if (chunk.keywords.some((k) => k.includes(qToken) || qToken.includes(k))) {
          matchCount += 3;
        } else if (chunkTokens.has(qToken) || Array.from(chunkTokens).some((ct) => ct.startsWith(qToken) || qToken.startsWith(ct))) {
          matchCount += 1;
        }
      }

      // Territory Affinity Boost
      if (detectedTerritory && chunk.territorySlug === detectedTerritory) {
        matchCount += 6;
      }

      if (matchCount === 0) continue;

      // Base score normalized by query length
      let bm25Score = matchCount / Math.max(1, queryTokens.size * 2.0);
      if (exactTitleMatch) bm25Score += 0.3;
      if (chunk.sourceType === 'PRIMARY_GOVERNMENT') bm25Score += 0.2;
      else if (chunk.sourceType === 'OFFICIAL_TOURISM') bm25Score += 0.1;

      const finalScore = Math.min(1.0, Math.round(bm25Score * 100) / 100);

      scoredResults.push({
        chunk,
        score: finalScore,
        matchType: 'HYBRID',
        citation: {
          id: chunk.id,
          sourceName: chunk.title,
          sourceUrl: chunk.sourceUrl,
          sourceType: chunk.sourceType,
          territory: chunk.territorySlug,
          verifiedAt: chunk.verifiedAt,
          lastUpdated: chunk.lastUpdated,
          confidenceState: chunk.verificationStatus,
        },
      });
    }

    // Sort descending by score
    scoredResults.sort((a, b) => b.score - a.score);
    return scoredResults.slice(0, topK);
  }

  private tokenize(text: string): Set<string> {
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1 && !this.stopWords.has(w));
    return new Set(words);
  }
}

export const hybridRetriever = new HybridRetrievalEngine();
