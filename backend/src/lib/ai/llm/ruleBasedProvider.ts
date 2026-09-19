/**
 * 🇮🇳 BHARAT SAFE YATRA — DETERMINISTIC SOVEREIGN RULE-BASED LLM PROVIDER
 * Phase 10: Sovereign Fallback Engine with zero external dependencies
 */

import { ILLMProvider, LLMCompletionOptions, LLMCompletionResponse } from './types';
import { ToolDefinition, ToolCall } from '../types';
import { VERIFIED_TERRITORIES, VERIFIED_DESTINATIONS, VERIFIED_FESTIVALS, VERIFIED_NATIONAL_CONTACTS } from '@/src/lib/fixtures';

export class RuleBasedProvider implements ILLMProvider {
  name = 'Sovereign-Rule-Engine';

  isAvailable(): boolean {
    return true; // Always available
  }

  async generateChatCompletion(
    messages: Array<{ role: 'system' | 'user' | 'assistant' | 'tool'; content: string; name?: string; tool_call_id?: string }>,
    tools?: ToolDefinition[],
    options?: LLMCompletionOptions
  ): Promise<LLMCompletionResponse> {
    const startTime = Date.now();
    const userMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const lower = userMsg.toLowerCase().trim();

    // Check for tool calling opportunities if tools are provided
    const toolCalls: ToolCall[] = [];

    // 1. Weather Intent -> call get_weather
    if (lower.includes('weather') || lower.includes('temperature') || lower.includes('forecast') || lower.includes('climate')) {
      let lat = 34.1526;
      let lng = 77.5771;
      let destSlug = 'leh-ladakh';

      if (lower.includes('andaman') || lower.includes('port blair') || lower.includes('havelock')) {
        lat = 11.6667;
        lng = 92.7486;
        destSlug = 'andaman';
      } else if (lower.includes('delhi')) {
        lat = 28.6139;
        lng = 77.209;
        destSlug = 'delhi';
      } else if (lower.includes('srinagar') || lower.includes('kashmir') || lower.includes('gulmarg')) {
        lat = 34.0837;
        lng = 74.7973;
        destSlug = 'srinagar';
      } else if (lower.includes('puducherry') || lower.includes('pondicherry')) {
        lat = 11.9416;
        lng = 79.8083;
        destSlug = 'puducherry';
      } else if (lower.includes('lakshadweep') || lower.includes('kavaratti')) {
        lat = 10.5667;
        lng = 72.6417;
        destSlug = 'lakshadweep';
      }

      if (tools?.some((t) => t.name === 'get_weather')) {
        toolCalls.push({
          id: `call_weather_${Date.now()}`,
          type: 'function',
          function: {
            name: 'get_weather',
            arguments: JSON.stringify({ lat, lng, destinationSlug: destSlug }),
          },
        });
      }
    }

    // 2. Routing Intent -> call calculate_route
    else if ((lower.includes('take me from') || lower.includes('route') || lower.includes('how long does') || lower.includes('distance between')) && lower.includes('to')) {
      if (tools?.some((t) => t.name === 'calculate_route')) {
        toolCalls.push({
          id: `call_route_${Date.now()}`,
          type: 'function',
          function: {
            name: 'calculate_route',
            arguments: JSON.stringify({
              origin: 'Leh Main Bazar',
              destination: 'Nubra Valley / Pangong',
              originLat: 34.1526,
              originLng: 77.5771,
              destLat: 33.753,
              destLng: 78.667,
              mode: 'driving',
            }),
          },
        });
      }
    }

    // 3. Emergency Intent -> call find_emergency_services
    else if (lower.includes('emergency') || lower.includes('sos') || lower.includes('hospital') || lower.includes('trauma') || lower.includes('near me')) {
      if (tools?.some((t) => t.name === 'find_emergency_services')) {
        toolCalls.push({
          id: `call_emergency_${Date.now()}`,
          type: 'function',
          function: {
            name: 'find_emergency_services',
            arguments: JSON.stringify({ lat: 34.1526, lng: 77.5771, radiusKm: 50 }),
          },
        });
      }
    }

    // 4. Festival Intent -> call search_festivals
    else if (lower.includes('festival') || lower.includes('events') || lower.includes('cultural celebration')) {
      let territorySlug: string | undefined;
      if (lower.includes('ladakh')) territorySlug = 'ladakh';
      else if (lower.includes('kashmir') || lower.includes('jammu')) territorySlug = 'jammu-kashmir';
      else if (lower.includes('andaman')) territorySlug = 'andaman-nicobar';

      if (tools?.some((t) => t.name === 'search_festivals')) {
        toolCalls.push({
          id: `call_festivals_${Date.now()}`,
          type: 'function',
          function: {
            name: 'search_festivals',
            arguments: JSON.stringify({ territorySlug }),
          },
        });
      }
    }

    // If tool calls were generated, return them for orchestration
    if (toolCalls.length > 0) {
      return {
        content: '',
        toolCalls,
        tokensUsed: 40,
        model: 'sovereign-rule-v1',
        latencyMs: Date.now() - startTime,
      };
    }

    // Otherwise generate grounded text
    let responseText = '';
    if (lower.includes('ladakh') || lower.includes('leh') || lower.includes('pangong')) {
      responseText = `Based on official **Ladakh Tourism Administration** verified guidelines:
• **Mandatory 48-Hour Acclimatization:** Rest in Leh (3,500m) is strictly mandatory before crossing high passes like Khardung La (5,359m) or Chang La (5,360m).
• **Pangong Tso Lake (4,350m):** High-altitude endorheic lake known for color transformations. Carry warm thermal layers and portable oxygen.
• **Inner Line Permits (ILP):** Required for Changthang, Pangong, and Nubra Valley via \`lahdclehpermit.in\`.
• **Emergency:** SNM District Hospital Leh is the primary trauma and hyperbaric oxygen center.`;
    } else if (lower.includes('lakshadweep') || lower.includes('epermit')) {
      responseText = `Based on official **UT Lakshadweep Administration** guidelines:
• **Mandatory ePermit:** All non-native tourists must apply at \`epermit.utl.gov.in\` with confirmed return flight/ship tickets and approved accommodation before departure from Kochi.
• **Protected Marine Ecology:** Removing coral, seashells, or disturbing marine turtles is strictly prohibited under the Wildlife Protection Act.
• **Primary Hubs:** Agatti Island (gateway airport), Bangaram Atoll (resort & scuba diving), Kavaratti (administrative capital).`;
    } else if (lower.includes('andaman') || lower.includes('cellular')) {
      responseText = `Based on verified **Directorate of Tourism, Andaman & Nicobar Administration** records:
• **Radhanagar Beach (Havelock / Swaraj Dweep):** Blue Flag certified white sand beach ideal for swimming.
• **Cellular Jail National Memorial:** Historical colonial landmark at Sri Vijaya Puram. Daily evening Sound & Light show.
• **Entry Formalities:** Indian citizens require no permit for main islands; foreign nationals can visit 30 designated islands without RAP.`;
    } else {
      responseText = `Namaste! I am **Yatra AI**, grounded in verified tourism intelligence for India's 8 Union Territories (*Andaman & Nicobar, Chandigarh, DNH & DD, Delhi, Jammu & Kashmir, Ladakh, Lakshadweep, Puducherry*).

How may I assist your travel preparation, weather check, or itinerary planning today?`;
    }

    return {
      content: responseText,
      tokensUsed: 120,
      model: 'sovereign-rule-v1',
      latencyMs: Date.now() - startTime,
    };
  }

  async generateStructured<T>(
    prompt: string,
    schemaDescription: string,
    options?: LLMCompletionOptions
  ): Promise<T | null> {
    return null;
  }
}
