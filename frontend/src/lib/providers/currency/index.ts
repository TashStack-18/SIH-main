/**
 * 🇮🇳 BHARAT SAFE YATRA — CURRENCY SERVICE ORCHESTRATOR
 * Phase 9B: Multi-Tier Currency Exchange Rate & Conversion Pipeline
 */

import { ExchangeRateProvider } from './exchangeRateProvider';
import { FrankfurterProvider } from './frankfurterProvider';
import { CurrencyExchangeResult } from '../types';
import { providerCache, deduplicateRequest } from '../cache';

const exchangeRateApi = new ExchangeRateProvider();
const frankfurter = new FrankfurterProvider();

export async function convertCurrencyWithFallback(
  amount: number,
  fromCurrency = 'INR',
  toCurrency = 'USD'
): Promise<CurrencyExchangeResult> {
  const cacheKey = `fx:${fromCurrency.toUpperCase()}:${toCurrency.toUpperCase()}:${amount}`;

  const cached = providerCache.get<CurrencyExchangeResult>(cacheKey);
  if (cached && !cached.isExpired) {
    return cached.data;
  }

  return deduplicateRequest(cacheKey, async () => {
    try {
      // 1. Primary: ExchangeRate-API
      const result = await exchangeRateApi.convertCurrency(amount, fromCurrency, toCurrency);
      if (result) {
        providerCache.set(cacheKey, result, 86400); // 24-hr cache
        return result;
      }
    } catch (err) {
      console.warn('[Currency Service] Primary FX failed, invoking Frankfurter ECB fallback:', err);
    }

    try {
      // 2. Secondary: Frankfurter ECB
      const fbResult = await frankfurter.convertCurrency(amount, fromCurrency, toCurrency);
      if (fbResult) {
        providerCache.set(cacheKey, fbResult, 86400);
        return fbResult;
      }
    } catch (err) {
      console.warn('[Currency Service] Frankfurter fallback failed:', err);
    }

    // 3. Deterministic Static Fallback
    const staticRates: Record<string, number> = {
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      AED: 0.044,
      SGD: 0.016,
      AUD: 0.018,
      CAD: 0.016,
      JPY: 1.82,
    };
    const rate = staticRates[toCurrency.toUpperCase()] || 0.012;

    const fallbackResult: CurrencyExchangeResult = {
      baseCurrency: fromCurrency.toUpperCase(),
      targetCurrency: toCurrency.toUpperCase(),
      rate,
      convertedAmount: Math.round(amount * rate * 100) / 100,
      metadata: {
        provider: 'Static Reference Exchange Rate',
        source: 'Reserve Bank of India (RBI) Reference Rate Baseline',
        retrievedAt: new Date().toISOString(),
        status: 'FALLBACK',
        isLive: false,
      },
    };

    providerCache.set(cacheKey, fallbackResult, 86400);
    return fallbackResult;
  });
}
