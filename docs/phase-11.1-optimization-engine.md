# 🇮🇳 Bharat Safe Yatra — Phase 11.1 Optimization Engine
## Transparent Route Re-sequencing & User-Controlled Proposals

### 1. Non-Negotiable Optimizer Rule
The optimizer **must not** silently alter, reorder, or drop stops from a traveller's itinerary. If an improved sequence exists that eliminates backtracking loops or reduces travel time, the optimizer presents a structured proposal:

```
+--------------------------------------------------------------------+
| ⚡ Route Optimizer Suggestion                                       |
| We found a more efficient route that saves ~42 km (~55 mins)        |
| Suggested: Leh → Nubra Valley → Pangong Tso                        |
|                                                                    |
| [ ✓ Apply Optimized Route ]            [ Keep My Plan ]            |
+--------------------------------------------------------------------+
```

---

### 2. Lock & Must-Visit Protection
1. **Locked Stops (`isLocked: true`)**: Cannot be repositioned by 2-opt or nearest-neighbor solvers. They remain pinned in their exact temporal slot.
2. **Must-Visit Stops (`isMustVisit: true`)**: Can be re-ordered for efficiency, but can **never** be removed during duration scaling (e.g. shortening from 7 days to 4 days).
3. **Optional Recommendations**: Sourced from along-the-route candidates and require an explicit `[ + Add Stop ]` action before entering the itinerary.

---

### 3. Progressive Optimization Architecture
- **Stage 1**: Fast deterministic itinerary generation upon destination selection ($\le 50\text{ ms}$).
- **Stage 2**: Background route geometry and feasibility computation.
- **Stage 3**: Background 2-opt permutation evaluation. If saved distance $\ge 3\text{ km}$ and saved time $\ge 5\text{ mins}$, a proposal is surfaced to the traveller.
