# 🇮🇳 BHARAT SAFE YATRA
## Phase 10 — AI Travel Intelligence Architecture
### SIH 2026

**Document Version:** 1.0  
**Phase:** 10 (Yatra AI + RAG + Agentic Intelligence)  
**Geographic Scope:** India's 8 Union Territories (*Andaman & Nicobar Islands, Chandigarh, Dadra & Nagar Haveli and Daman & Diu, Delhi, Jammu & Kashmir, Ladakh, Lakshadweep, Puducherry*)  
**Status:** **OPERATIONAL & VERIFIED**

---

# 1. Architectural Philosophy

Yatra AI is designed not as a generic conversational chatbot, but as a **Source-Grounded, Tool-Using, Verified Travel Intelligence System**.

```text
                           ┌───────────────────────────┐
                           │       USER REQUEST        │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   AI INTERFACE (UI/UX)    │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │     SECURITY GATEWAY      │
                           │ (Prompt Injection / PII)  │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │   YATRA AI ORCHESTRATOR   │
                           └───────┬───────────┬───────┘
                                   │           │
                 ┌─────────────────┘           └─────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    HYBRID RAG RETRIEVAL   │                   │  CONTROLLED TOOL REGISTRY │
   │ (BM25 + Vector + Meta)    │                   │ (Weather, Routes, Flights)│
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
                 └─────────────────┐           ┌─────────────────┘
                                   ▼           ▼
                           ┌───────────────────────────┐
                           │    LLM REASONING LAYER    │
                           │  (OpenAI / Sovereign Fall)│
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │    VALIDATION & GUARD     │
                           │ (Hallucination / Citation)│
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │  GROUNDED CLIENT RESPONSE │
                           │  (Text + Cards + Sources) │
                           └───────────────────────────┘
```

---

# 2. LLM Provider Abstraction (`src/lib/ai/llm/`)

To prevent single-vendor lock-in and guarantee 100% uptime:
1. **Interface Contract (`ILLMProvider`):** Standardizes completion, structured JSON generation, tool-calling, and vector embeddings.
2. **Primary Provider (`OpenAiProvider`):**
   - **Fast Model:** `gpt-4o-mini` (General chat synthesis, extraction, quick turnarounds).
   - **Reasoning Model:** `gpt-4o` (Complex multi-destination constraint optimization).
   - **Embeddings:** `text-embedding-3-small` (1536-dim vector embeddings).
3. **Sovereign Fallback Engine (`RuleBasedProvider`):**
   - In-memory deterministic reasoning engine.
   - Operates fully offline during network partition without external LLM dependencies.
   - Emits structured tool calls and grounded knowledge summaries.

---

# 3. Request Lifecycle & Orchestration Loop

1. **Prompt Sanitization:** User messages pass through the PII Redaction Filter (`sanitizePII`) and Adversarial Injection Guard (`evaluatePromptSecurity`).
2. **Context Retrieval:** Hybrid RAG queries verified government chunks and isolates them into read-only XML blocks (`<VERIFIED_GOVERNMENT_KNOWLEDGE>`).
3. **Agentic Tool Calling:** If the query requires dynamic real-time data (live weather, road route, flight schedules, emergency proximity), the LLM executes controlled tools.
4. **Loop Protection:** Maximum tool execution cycles are capped at 3 with a 10-second timeout per tool.
5. **Response Synthesis & Citation Verification:** The output is cross-referenced against authoritative sources. Citations include official source name, URL, and verification date.
6. **Action Confirmation Enforcement:** State mutations (such as saving itineraries) require explicit user confirmation before execution.
