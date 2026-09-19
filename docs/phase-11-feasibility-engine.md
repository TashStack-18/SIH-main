# 🇮🇳 Bharat Safe Yatra — Phase 11: Feasibility & Health Engine

## 1. Engine Purpose & Objectives
The Feasibility Engine (`src/lib/itinerary/feasibilityEngine.ts`) prevents unrealistic, fatigue-inducing, or dangerous itineraries across Indian terrain (mountain passes in Ladakh/J&K, island boat transits in Lakshadweep/Andaman).

---

## 2. Validation Checks

### 2.1 Daily Driving Limits
- **Relaxed**: $\le 5\text{ hours}$ driving per day.
- **Balanced**: $\le 7\text{ hours}$ driving per day.
- **Fast-Paced / Adventure**: $\le 9\text{ hours}$ driving per day.

### 2.2 Safety & Traffic Buffer
An **18% buffer** is automatically reserved on top of pure driving estimates to account for mountain switchbacks, monsoon conditions, military checkpoints, and rest stops.

### 2.3 Opening Hours & Permit Validation
- Compares calculated arrival times against verified opening hours (e.g. flagging arrival after 5:00 PM for ASI monuments).
- Flags mandatory Inner Line Permits (ILP) or Protected Area Permits (PAP) with links to official UT administration portals.

### 2.4 Itinerary Health Status
- `EXCELLENT`: Balanced schedule with healthy travel buffers.
- `GOOD`: Feasible schedule; permits or seasonal precautions highlighted.
- `BUSY`: Driving times near maximum daily threshold.
- `VERY_BUSY`: Driving times exceed thresholds; rest blocks recommended.
- `INFEASIBLE`: Impossible or dangerous itinerary (e.g. >8 remote stops or >450 km in a single mountain day).
