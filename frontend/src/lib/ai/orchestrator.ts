/**
 * 🇮🇳 BHARAT SAFE YATRA — MASTER AGENTIC TRAVEL INTELLIGENCE ORCHESTRATOR
 * Phase 10: RAG + Agentic Tool Execution + Security Defense + Grounded Synthesis
 */

import { ChatMessage, SourceCitation, ActionProposal, AiWidgetData } from './types';
import { getLLMProvider } from './llm';
import { retrieveRAGContext } from './rag';
import { toolRegistry } from './tools';
import { evaluatePromptSecurity, buildSystemInstructions } from './security/promptDefense';
import { sanitizePII } from './security/piiSanitizer';
import { validateAndGuardResponse } from './security/validator';

export interface OrchestrationOptions {
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  userLocation?: { lat: number; lng: number };
  userPreferences?: { territory?: string; travelStyle?: string };
}

export class YatraAiOrchestrator {
  private maxToolCycles = 3;

  public async processUserMessage(
    userMessage: string,
    options?: OrchestrationOptions
  ): Promise<ChatMessage> {
    const startTime = Date.now();
    const executedToolNames: string[] = [];
    const collectedToolCitations: SourceCitation[] = [];
    let actionProposal: ActionProposal | null = null;
    let widget: AiWidgetData | null = null;

    // 1. Security Check (Prompt Injection Defense)
    const securityCheck = evaluatePromptSecurity(userMessage);
    if (!securityCheck.isSafe) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: securityCheck.sanitizedText,
        citations: [
          {
            sourceName: 'Bharat Safe Yatra Security & Safety Guidelines',
            sourceUrl: 'https://112.gov.in',
            sourceType: 'PRIMARY_GOVERNMENT',
            verifiedAt: '2026-08-26',
            confidenceState: 'VERIFIED',
          },
        ],
        actionProposal: null,
        widget: null,
        metadata: {
          latencyMs: Date.now() - startTime,
          isGrounded: true,
        },
      };
    }

    // 2. PII Sanitization
    const { sanitized: cleanUserMessage } = sanitizePII(userMessage);

    // 3. RAG Retrieval (Grounding in Verified Government Knowledge)
    const ragContext = retrieveRAGContext(cleanUserMessage);

    // 4. Build Prompt Thread
    const systemPrompt = `${buildSystemInstructions()}\n\n${ragContext.formattedContext}`;

    const messages: Array<{
      role: 'system' | 'user' | 'assistant' | 'tool';
      content: string;
      name?: string;
      tool_call_id?: string;
    }> = [{ role: 'system', content: systemPrompt }];

    // Append recent conversation history
    if (options?.conversationHistory) {
      const recent = options.conversationHistory.slice(-6);
      for (const h of recent) {
        messages.push({ role: h.role, content: h.content });
      }
    }

    // Append current user message
    messages.push({ role: 'user', content: cleanUserMessage });

    const llm = getLLMProvider();
    const availableTools = toolRegistry.getToolDefinitions();

    let finalContent = '';
    let tokensUsed = 0;
    let cycles = 0;

    // 5. Agentic Tool Execution Loop with Circuit Breaker
    while (cycles < this.maxToolCycles) {
      cycles++;

      const completion = await llm.generateChatCompletion(messages, availableTools, {
        modelClass: 'FAST',
        temperature: 0.2,
      });

      tokensUsed += completion.tokensUsed || 0;

      // Case A: Model wants to execute one or more tools
      if (completion.toolCalls && completion.toolCalls.length > 0) {
        messages.push({
          role: 'assistant',
          content: completion.content || '',
        });

        for (const tc of completion.toolCalls) {
          executedToolNames.push(tc.function.name);

          const toolResult = await toolRegistry.executeTool(
            tc.function.name,
            tc.function.arguments,
            tc.id
          );

          if (toolResult.citations) {
            collectedToolCitations.push(...toolResult.citations);
          }

          if (toolResult.requiresUserConfirmation && toolResult.confirmationPayload) {
            actionProposal = toolResult.confirmationPayload;
          }

          // Build UI widgets
          if (tc.function.name === 'get_weather' && toolResult.success) {
            widget = { type: 'WEATHER_CARD', data: toolResult.data };
          } else if (tc.function.name === 'calculate_route' && toolResult.success) {
            widget = { type: 'ROUTE_CARD', data: toolResult.data };
          } else if (tc.function.name === 'find_emergency_services' && toolResult.success) {
            widget = { type: 'EMERGENCY_CARD', data: toolResult.data };
          } else if (tc.function.name === 'create_itinerary_proposal' && toolResult.success) {
            widget = { type: 'ITINERARY_PREVIEW', data: toolResult.data };
          }

          messages.push({
            role: 'tool',
            name: tc.function.name,
            tool_call_id: tc.id,
            content: JSON.stringify(toolResult),
          });
        }
        // Continue loop to let model synthesize answer with tool data
      } else {
        // Case B: Model returned terminal textual answer
        finalContent = completion.content;
        break;
      }
    }

    // If finalContent is empty after tool execution (e.g. from fallback engine), generate synthesis
    if (!finalContent) {
      const lastToolMsg = messages.filter((m) => m.role === 'tool').pop();
      if (lastToolMsg) {
        finalContent = `Here is the verified information retrieved from our live services:\n\n${lastToolMsg.content}`;
      } else {
        finalContent = `I have verified our official knowledge base regarding your query. How else may I assist your travel planning?`;
      }
    }

    // 6. Response Validation & Hallucination Guard
    const validation = validateAndGuardResponse(
      finalContent,
      ragContext.citations,
      collectedToolCitations
    );

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: validation.sanitizedContent,
      citations: validation.citations,
      actionProposal: actionProposal || null,
      widget: widget || null,
      metadata: {
        model: llm.name,
        tokensUsed,
        latencyMs: Date.now() - startTime,
        retrievalCount: ragContext.totalRetrieved,
        toolsExecuted: executedToolNames,
        isGrounded: true,
      },
    };
  }
}

export const yatraAiOrchestrator = new YatraAiOrchestrator();
