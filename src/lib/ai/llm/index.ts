/**
 * 🇮🇳 BHARAT SAFE YATRA — LLM PROVIDER FACTORY
 * Phase 10: Dynamic provider selection with graceful fallback
 */

import { ILLMProvider } from './types';
import { OpenAiProvider } from './openAiProvider';
import { RuleBasedProvider } from './ruleBasedProvider';

const openAiProvider = new OpenAiProvider();
const ruleBasedProvider = new RuleBasedProvider();

export function getLLMProvider(): ILLMProvider {
  if (openAiProvider.isAvailable()) {
    return openAiProvider;
  }
  return ruleBasedProvider;
}

export * from './types';
export { OpenAiProvider, RuleBasedProvider };
