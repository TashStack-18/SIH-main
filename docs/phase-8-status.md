# Phase 8 Status — Backend Audit

## Executive Summary

The current repository is a pure Next.js 14 App Router frontend. No NestJS, no Prisma, no DB migrations, no API routes. All services return in-memory fixture data.

Phase 8 will implement real API Route Handlers inside `src/app/api/v1/`, fix all existing TypeScript errors, add Zod validation, JWT auth, and connect the OpenAI provider.

## Critical Errors Found

| ID | File | Error | Severity |
|---|---|---|---|
| E-01 | src/lib/fixtures/index.ts | Import path `../../src/js/data/` — impossible relative path from inside src/lib/fixtures/ | CRITICAL |
| E-02 | src/config/env.ts | Mapbox token has fake demo placeholder hardcoded | HIGH |
| E-03 | src/services/safetyService.ts | SOS returns index[0], not geographically nearest | HIGH |
| E-04 | src/services/aiService.ts | Canned string responses — no OpenAI call | HIGH |
| E-05 | src/services/mapService.ts | Route hardcoded 340km/9h45m | HIGH |
| E-06 | src/services/itineraryService.ts | localStorage — SSR incompatible | HIGH |
| E-07 | tsconfig.json | @/* resolves to ./src/* but imports use @/src/ double prefix | HIGH |
| E-08 | node_modules | next/tsc not installed — npm install required | CRITICAL |

## Missing API Routes

None exist currently. To be built: `/api/v1/territories`, `/api/v1/destinations`, `/api/v1/festivals`, `/api/v1/safety/*`, `/api/v1/itineraries`, `/api/v1/maps/*`, `/api/v1/weather`, `/api/v1/ai/*`, `/api/v1/auth/*`, `/api/v1/users/*`, `/api/v1/health`

## Architecture Decision

Backend implemented as Next.js Route Handlers (src/app/api/v1/) — consistent with the existing stack and the already-declared NEXT_PUBLIC_API_BASE_URL=/api/v1 in .env.example.
