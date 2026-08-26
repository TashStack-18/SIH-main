# 🇮🇳 Bharat Safe Yatra — Phase 12: Component Hierarchy & Mapping

## 1. Component Tree

```text
src/app/ai/page.tsx (Page Shell with <Suspense>)
  └── YatraAiWorkspace.tsx (Master Layout Controller & Context Coordinator)
        ├── YatraAiConversation.tsx (Left Panel: 55%)
        │     ├── ConversationHeader (Live Status, + New Chat)
        │     ├── MessageStream (Scrollable History)
        │     │     ├── WelcomeCard (Initial State & Prompt Chips)
        │     │     ├── UserMessageCard (Terracotta right-aligned bubble)
        │     │     ├── AssistantMessageCard (Structured editorial block)
        │     │     ├── SourceCitationsStrip (Clickable official links)
        │     │     ├── ActionProposalCard (Direct routing / planning CTA)
        │     │     └── ThinkingIndicator (Subtle pulsing live query status)
        │     └── StickyComposer (Auto-growing textarea + send trigger)
        │
        └── YatraAiTravelContext.tsx (Right Panel: 45% / Mobile Bottom-Sheet)
              ├── ContextHeader (Mode Title, Reset Action)
              ├── ActiveChipsStrip (e.g. LADAKH • 5 DAYS • PHOTOGRAPHY)
              ├── DestinationView (Image, Coordinates, Best Time, Add to Itinerary)
              ├── ItineraryView (Trip Overview, Stops Sequence, Studio CTA)
              ├── RouteMapView (TomTom Waypoints, Distance, Drive Time)
              ├── WeatherTelemetryView (Live Temp, Condition, Humidity, Wind)
              ├── BookingView (Official Licensed Providers & Redirects)
              ├── SafetyRadarView (Emergency Medical & Police Facilities)
              └── DefaultUtExplorerView (8 Union Territory Discovery Cards)
```
