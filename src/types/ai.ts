/**
 * 🇮🇳 BHARAT SAFE YATRA — AI COMPANION TYPES
 */

export type AIRole = 'user' | 'assistant' | 'system' | 'tool';

export interface AICitation {
  title: string;
  url: string;
  verified?: boolean;
}

export interface AIActionProposal {
  type: 'OPTIMIZE_ITINERARY' | 'ADD_STOP' | 'WEATHER_ALERT' | 'CHANGE_DURATION';
  title: string;
  day: number;
  territorySlug?: string;
  item: {
    time: string;
    title: string;
    type: string;
    notes?: string;
  };
}

export interface AIMessage {
  id: string;
  role: AIRole;
  timestamp: string;
  content: string;
  citations?: AICitation[];
  actionProposal?: AIActionProposal | null;
}

export interface AIChatState {
  isOpen: boolean;
  isThinking: boolean;
  messages: AIMessage[];
}
