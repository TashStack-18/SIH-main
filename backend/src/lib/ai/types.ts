/**
 * 🇮🇳 BHARAT SAFE YATRA — AI & RAG INTELLIGENCE CORE TYPES
 * Phase 10: Yatra AI + RAG + Agentic Travel Intelligence
 */

export type SourcePriority =
  | 'PRIMARY_GOVERNMENT'
  | 'OFFICIAL_TOURISM'
  | 'OFFICIAL_PROVIDER'
  | 'GOVERNMENT'
  | 'VERIFIED_SECONDARY'
  | 'LIVE_DATA';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PARTIALLY_VERIFIED'
  | 'INFORMATIONAL'
  | 'LIVE_DATA'
  | 'UNAVAILABLE';

export interface SourceCitation {
  id?: string;
  sourceName: string;
  sourceUrl: string;
  sourceType: SourcePriority;
  territory?: string;
  verifiedAt: string;
  lastUpdated?: string;
  confidenceState: VerificationStatus;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  name?: string;
  timestamp: string;
  toolCalls?: ToolCall[];
  toolResultId?: string;
  citations?: SourceCitation[];
  actionProposal?: ActionProposal | null;
  widget?: AiWidgetData | null;
  metadata?: {
    model?: string;
    tokensUsed?: number;
    latencyMs?: number;
    retrievalCount?: number;
    toolsExecuted?: string[];
    isGrounded?: boolean;
    isFallback?: boolean;
  };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string; // JSON encoded string
  };
}

export interface ToolDefinition {
  name: string;
  description: string;
  isWriteAction: boolean;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
      items?: Record<string, unknown>;
    }>;
    required?: string[];
  };
}

export interface ToolResult {
  toolCallId: string;
  toolName: string;
  success: boolean;
  data: unknown;
  error?: string;
  citations?: SourceCitation[];
  isLive: boolean;
  requiresUserConfirmation?: boolean;
  confirmationPayload?: ActionProposal;
}

export interface ActionProposal {
  type:
    | 'CONFIRM_ITINERARY_CREATE'
    | 'CONFIRM_ITINERARY_MODIFY'
    | 'NAVIGATE_ROUTE'
    | 'VIEW_DESTINATION'
    | 'VIEW_FESTIVALS'
    | 'BOOK_STAY'
    | 'EMERGENCY_DISPATCH';
  title: string;
  description?: string;
  territorySlug?: string;
  destinationId?: string;
  url?: string;
  payload?: unknown;
  requiresConfirmation: boolean;
}

export interface AiWidgetData {
  type: 'WEATHER_CARD' | 'ROUTE_CARD' | 'DESTINATION_CARD' | 'FESTIVAL_CARD' | 'EMERGENCY_CARD' | 'HOTEL_CARD' | 'ITINERARY_PREVIEW';
  data: unknown;
}

export interface StructuredItineraryDay {
  dayNumber: number;
  date?: string;
  title: string;
  summary: string;
  destination: string;
  territory: string;
  estimatedTravelTimeMins?: number;
  estimatedDistanceKm?: number;
  items: Array<{
    id: string;
    time: string;
    title: string;
    type: 'ATTRACTION' | 'EXPERIENCE' | 'HOTEL' | 'RESTAURANT' | 'TRANSPORT' | 'REST_ACCLIMATIZATION' | 'CUSTOM';
    notes: string;
    safetyAdvisory?: string;
  }>;
  safetyNote?: string;
}

export interface StructuredItinerary {
  id?: string;
  title: string;
  territory: string;
  territorySlug: string;
  durationDays: number;
  travellers: number;
  travelStyle: string;
  estimatedBudgetINR: number;
  days: StructuredItineraryDay[];
  totalDistanceKm?: number;
  totalTravelTimeMinutes?: number;
  routeFeasibility: 'VERIFIED_FEASIBLE' | 'REQUIRES_CAUTION' | 'RESTRICTED';
  warnings: string[];
  sources: SourceCitation[];
}
