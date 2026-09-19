/**
 * 🇮🇳 BHARAT SAFE YATRA — OPENAI LLM PROVIDER
 * Phase 10: Model Routing with Graceful Sovereign Fallback
 */

import { ILLMProvider, LLMCompletionOptions, LLMCompletionResponse } from './types';
import { ToolDefinition, ToolCall } from '../types';
import { RuleBasedProvider } from './ruleBasedProvider';

const ruleBasedFallback = new RuleBasedProvider();

export class OpenAiProvider implements ILLMProvider {
  name = 'OpenAI-Engine';

  private getApiKey(): string | null {
    const key = process.env.OPENAI_API_KEY;
    if (!key || key.includes('your_real') || !key.startsWith('sk-')) return null;
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
    const model = options?.modelClass === 'REASONING' ? 'gpt-4o' : 'gpt-4o-mini';

    const payload: Record<string, unknown> = {
      model,
      messages: messages.map((m) => {
        if (m.role === 'tool') {
          return {
            role: 'tool',
            content: m.content,
            tool_call_id: m.tool_call_id || 'call_default',
          };
        }
        return {
          role: m.role,
          content: m.content,
        };
      }),
      temperature: options?.temperature ?? 0.2,
      max_tokens: options?.maxTokens ?? 1200,
    };

    if (options?.responseFormat === 'json_object') {
      payload.response_format = { type: 'json_object' };
    }

    if (tools && tools.length > 0) {
      payload.tools = tools.map((t) => ({
        type: 'function',
        function: {
          name: t.name,
          description: t.description,
          parameters: t.parameters,
        },
      }));
    }

    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`[OpenAiProvider] OpenAI API error (${res.status}), invoking sovereign rule engine fallback.`);
        return ruleBasedFallback.generateChatCompletion(messages, tools, options);
      }

      const data = (await res.json()) as {
        choices?: Array<{
          message?: {
            content?: string;
            tool_calls?: Array<{
              id: string;
              type: 'function';
              function: { name: string; arguments: string };
            }>;
          };
        }>;
        usage?: { total_tokens?: number };
      };

      const choice = data.choices?.[0]?.message;
      const content = choice?.content || '';
      const toolCalls: ToolCall[] | undefined = choice?.tool_calls?.map((tc) => ({
        id: tc.id,
        type: 'function',
        function: {
          name: tc.function.name,
          arguments: tc.function.arguments,
        },
      }));

      return {
        content,
        toolCalls,
        tokensUsed: data.usage?.total_tokens ?? 0,
        model,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      console.warn('[OpenAiProvider] Network or API exception, falling back to sovereign rule engine:', err);
      return ruleBasedFallback.generateChatCompletion(messages, tools, options);
    }
  }

  async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMCompletionOptions
  ): Promise<T | null> {
    const messages = [
      {
        role: 'system' as const,
        content: `You are a structured data extractor for Bharat Safe Yatra. Output ONLY valid JSON matching this schema: ${schemaDescription}. Do not include markdown wraps or commentary.`,
      },
      { role: 'user' as const, content: prompt },
    ];

    const res = await this.generateChatCompletion(messages, undefined, {
      ...options,
      responseFormat: 'json_object',
      temperature: 0.1,
    });

    try {
      return JSON.parse(res.content) as T;
    } catch {
      return null;
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const apiKey = this.getApiKey();
    if (!apiKey) throw new Error('OpenAI API key is not configured');

    const res = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: texts,
      }),
    });

    if (!res.ok) {
      throw new Error(`OpenAI Embeddings error: ${res.status}`);
    }

    const data = (await res.json()) as {
      data: Array<{ embedding: number[] }>;
    };

    return data.data.map((d) => d.embedding);
  }
}
