/**
 * 🇮🇳 BHARAT SAFE YATRA — AI TOOL DEFINITIONS & SCHEMAS
 * Phase 10: Controlled Tool Registry (Read vs Write Separation)
 */

import { ToolDefinition, ToolResult } from '../types';

export interface ToolExecutor {
  definition: ToolDefinition;
  execute(args: Record<string, unknown>, toolCallId: string): Promise<ToolResult>;
}
