/**
 * 🇮🇳 BHARAT SAFE YATRA — LLM PROVIDER INTERFACES
 * Phase 10: Model Provider Abstraction
 */

import { ChatMessage, ToolDefinition, ToolCall } from '../types';

export interface LLMCompletionOptions {
  modelClass?: 'FAST' | 'REASONING' | 'EMBEDDING';
  temperature?: number;
  maxTokens?: number;
  timeoutMs?: number;
  responseFormat?: 'text' | 'json_object';
}

export interface LLMCompletionResponse {
  content: string;
  toolCalls?: ToolCall[];
  tokensUsed?: number;
  model: string;
  latencyMs: number;
}

export interface ILLMProvider {
  name: string;
  isAvailable(): boolean;
  generateChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string; name?: string; tool_call_id?: string }>,
    tools?: ToolDefinition[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResponse>;
  generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMCompletionOptions
  ): Promise<T | null>;
  generateEmbeddings?(texts: string[]): Promise<number[][]>;
}
