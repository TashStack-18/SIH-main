/**
 * 🇮🇳 BHARAT SAFE YATRA — RAG ENGINE ORCHESTRATOR
 * Phase 10: Unified entry point for knowledge retrieval & context generation
 */

import { hybridRetriever } from './retrieval';
import { ragReranker } from './reranker';
import { RAGFilter, RAGContext } from './types';

export function retrieveRAGContext(query: string, filter?: RAGFilter, topK = 5): RAGContext {
  const searchResults = hybridRetriever.search(query, filter, topK);
  return ragReranker.curateContext(searchResults);
}

export * from './types';
export { knowledgeIngestion } from './ingestion';
export { hybridRetriever } from './retrieval';
export { ragReranker } from './reranker';
