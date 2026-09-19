# 🇮🇳 Bharat Safe Yatra — Phase 11: Recommendation & Optimization Engine

## 1. Scope & Principles
The recommendation engine (`src/lib/itinerary/recommendationEngine.ts`) powers intelligent trip re-balancing, duration scaling, and route-aware suggestions.

---

## 2. Duration Scaling Logic
- **Scaling Down (e.g. 7 Days → 4 Days)**:
  - Preserves marquee heritage sites (UNESCO monuments, high passes, iconic atolls).
  - Drops low-density secondary stops to keep daily driving within safety limits.
- **Scaling Up (e.g. 3 Days → 6 Days)**:
  - Pulls verified attractions in the same Union Territory.
  - Injects dedicated relaxation and cultural immersion blocks rather than filler.

---

## 3. Personalization Factors
- **Travel Style Profiles**:
  - `RELAXED`: Max 2 stops/day, early wrap-up.
  - `BALANCED`: Standard 3–4 stops/day with meal buffers.
  - `PHOTOGRAPHY`: Prioritizes golden hour viewpoints and Bortle-1 dark sky reserves.
  - `CULTURAL`: Emphasizes monastic ceremonies, museums, and local artisan clusters.
  - `ADVENTURE`: Incorporates high-altitude passes, trekking trails, and coral lagoons.
