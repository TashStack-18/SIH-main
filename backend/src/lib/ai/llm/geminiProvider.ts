/**
 * 🇮🇳 BHARAT SAFE YATRA — GOOGLE GEMINI LLM PROVIDER
 * Sovereign integration for Google Gemini models with graceful sovereign fallback
 */

import { ILLMProvider, LLMCompletionOptions, LLMCompletionResponse } from './types';
import { ToolDefinition } from '../types';
import { RuleBasedProvider } from './ruleBasedProvider';

const ruleBasedFallback = new RuleBasedProvider();

export class GeminiProvider implements ILLMProvider {
  name = 'Google-Gemini-Engine';

  private getApiKey(): string | null {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!key || key.includes('your_real') || key.length < 10) return null;
    return key;
  }

  isAvailable(): boolean {
    return this.getApiKey() !== null;
  }

  async generateChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string; name?: string; tool_call_id?: string }>,
    tools?: ToolDefinition[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResponse> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      return ruleBasedFallback.generateChatCompletion(messages, tools, options);
    }

    const startTime = Date.now();
    const model = 'gemini-1.5-flash';

    // Format messages for Gemini API
    // Gemini supports system_instruction and contents (parts)
    const systemMessage = messages.find((m) => m.role === 'system');
    const conversationMessages = messages.filter((m) => m.role !== 'system');

    const contents = conversationMessages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.role === 'tool' ? `Tool Result (${m.name || 'tool'}): ${m.content}` : m.content }],
    }));

    const payload: Record<string, unknown> = {
      contents: contents.length > 0 ? contents : [{ role: 'user', parts: [{ text: 'Hello' }] }],
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        maxOutputTokens: options?.maxTokens ?? 1200,
      },
    };

    if (systemMessage) {
      payload.systemInstruction = {
        parts: [{ text: systemMessage.content }],
      };
    }

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[GeminiProvider] Gemini API error (${res.status}), invoking sovereign fallback.`);
        return ruleBasedFallback.generateChatCompletion(messages, tools, options);
      }

      const data = (await res.json()) as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
        usageMetadata?: { totalTokenCount?: number };
      };

      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.map((p) => p.text || '').join('\n') || '';

      if (!text.trim()) {
        return ruleBasedFallback.generateChatCompletion(messages, tools, options);
      }

      return {
        content: text,
        tokensUsed: data.usageMetadata?.totalTokenCount || 150,
        model,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      console.warn('[GeminiProvider] Fetch error, invoking sovereign fallback:', err);
      return ruleBasedFallback.generateChatCompletion(messages, tools, options);
    }
  }

  async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMCompletionOptions
  ): Promise<T | null> {
    return null;
  }
}
