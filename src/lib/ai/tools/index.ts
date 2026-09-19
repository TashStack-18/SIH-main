/**
 * 🇮🇳 BHARAT SAFE YATRA — CONTROLLED AI TOOL REGISTRY
 * Phase 10: Master Tool Registry & Safe Execution Engine
 */

import { ToolExecutor } from './types';
import { ToolDefinition, ToolResult } from '../types';
import {
  getWeatherTool,
  calculateRouteTool,
  searchDestinationsTool,
  searchFestivalsTool,
  findEmergencyServicesTool,
  searchFlightsTool,
  searchHotelsTool,
} from './readTools';
import { createItineraryProposalTool } from './writeTools';

class ToolRegistry {
  private tools: Map<string, ToolExecutor> = new Map();

  constructor() {
    this.register(getWeatherTool);
    this.register(calculateRouteTool);
    this.register(searchDestinationsTool);
    this.register(searchFestivalsTool);
    this.register(findEmergencyServicesTool);
    this.register(searchFlightsTool);
    this.register(searchHotelsTool);
    this.register(createItineraryProposalTool);
  }

  public register(executor: ToolExecutor) {
    this.tools.set(executor.definition.name, executor);
  }

  public getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((t) => t.definition);
  }

  public async executeTool(
    name: string,
    rawArgs: string | Record<string, unknown>,
    toolCallId: string
  ): Promise<ToolResult> {
    const executor = this.tools.get(name);
    if (!executor) {
      return {
        toolCallId,
        toolName: name,
        success: false,
        data: null,
        error: `Tool "${name}" is not registered in the Bharat Safe Yatra tool registry.`,
        isLive: false,
      };
    }

    let parsedArgs: Record<string, unknown> = {};
    if (typeof rawArgs === 'string') {
      try {
        parsedArgs = JSON.parse(rawArgs);
      } catch {
        return {
          toolCallId,
          toolName: name,
          success: false,
          data: null,
          error: `Invalid JSON arguments passed to tool "${name}".`,
          isLive: false,
        };
      }
    } else {
      parsedArgs = rawArgs;
    }

    // Execute with 10-second timeout guard
    try {
      const result = await Promise.race([
        executor.execute(parsedArgs, toolCallId),
        new Promise<ToolResult>((_, reject) =>
          setTimeout(() => reject(new Error(`Tool "${name}" timed out after 10000ms`)), 10000)
        ),
      ]);
      return result;
    } catch (err: unknown) {
      return {
        toolCallId,
        toolName: name,
        success: false,
        data: null,
        error: `Execution error in tool "${name}": ${err instanceof Error ? err.message : String(err)}`,
        isLive: false,
      };
    }
  }
}

export const toolRegistry = new ToolRegistry();
export * from './types';
