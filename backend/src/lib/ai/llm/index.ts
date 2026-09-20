/**
 * 🇮🇳 BHARAT SAFE YATRA — LLM PROVIDER FACTORY
 * Phase 10: Dynamic provider selection with graceful fallback
 */

import { ILLMProvider } from './types';
import { GeminiProvider } from './geminiProvider';
import { OpenAiProvider } from './openAiProvider';
import { RuleBasedProvider } from './ruleBasedProvider';

const geminiProvider = new GeminiProvider();
const openAiProvider = new OpenAiProvider();
const ruleBasedProvider = new RuleBasedProvider();

export function getLLMProvider(): ILLMProvider {
  if (geminiProvider.isAvailable()) {
    return geminiProvider;
  }
  if (openAiProvider.isAvailable()) {
    return openAiProvider;
  }
  return ruleBasedProvider;
}

export * from './types';
export { GeminiProvider, OpenAiProvider, RuleBasedProvider };
