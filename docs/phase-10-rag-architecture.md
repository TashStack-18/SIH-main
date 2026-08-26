# 🇮🇳 BHARAT SAFE YATRA
## Phase 10 — RAG Knowledge Base Architecture
### SIH 2026

**Document Version:** 1.0  
**Phase:** 10 (Retrieval-Augmented Generation Architecture)  
**Geographic Scope:** India's 8 Union Territories  
**Status:** **OPERATIONAL & VERIFIED**

---

# 1. Knowledge Ingestion Pipeline

```text
┌──────────────────────────────┐
│  VERIFIED GOVERNMENT DATA    │ (Destinations, Territories, Festivals,
│  (Phase 5 Sovereign Base)    │  Safety Advisories, Emergency Regs)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   CLEANING & NORMALIZATION   │ (Strip HTML, normalize UTF-8,
│   (Ingestion Pipeline)       │  extract territory & category tags)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│    CHUNKING & METADATA       │ (Chunk by domain: Overview, Safety,
│    (KnowledgeChunk Engine)   │  Permits, Gastronomy, Festivals)
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   HYBRID INDEX STORAGE       │ (Vector Embeddings + BM25 Inverted
│   (pgvector + In-Memory)     │  Index + Metadata Tag Index)
└──────────────────────────────┘
```

---

# 2. Knowledge Chunk Metadata Schema

Every indexed knowledge chunk preserves strict provenance:

```typescript
export interface KnowledgeChunk {
  id: string;                      // Unique chunk identifier (e.g. chunk-pangong-tso-safety-permits)
  documentId: string;              // Parent document identifier
  title: string;                   // Human-readable authoritative title
  content: string;                 // Extracted factual content
  territorySlug?: string;          // Territory slug (e.g. ladakh, lakshadweep)
  destinationId?: string;          // Destination ID (e.g. pangong-tso)
  category: string;                // DESTINATION | PERMIT | SAFETY | FESTIVAL | CULTURE
  sourceUrl: string;               // Authoritative government URL
  sourceType: SourcePriority;      // PRIMARY_GOVERNMENT | OFFICIAL_TOURISM
  verificationStatus: string;      // VERIFIED | LIVE_DATA
  verifiedAt: string;              // ISO timestamp of statutory verification
  lastUpdated: string;             // Last update timestamp
  keywords: string[];              // Keyword tokens for BM25 retrieval
}
```

---

# 3. Hybrid Retrieval & Disambiguation Engine

The retrieval algorithm executes a multi-stage scoring pipeline:

1. **Territory Disambiguation:** Automatically detects geographic context from user queries (e.g. "Ladakh", "Leh", "Nubra" $\rightarrow$ `ladakh`; "Lakshadweep", "Agatti" $\rightarrow$ `lakshadweep`).
2. **Metadata Filtering:** Prioritizes chunks matching the target territory while excluding unrelated regions.
3. **BM25 Keyword Matching:** Tokenizes query against chunk titles, keywords, and content bodies with stemming.
4. **Authoritative Source Boosting:** Grants score bonuses to `PRIMARY_GOVERNMENT` and `OFFICIAL_TOURISM` documents.
5. **Deduplication & Reranking:** Top $K$ results are deduplicated by source URL and formatted into an immutable XML context block.
