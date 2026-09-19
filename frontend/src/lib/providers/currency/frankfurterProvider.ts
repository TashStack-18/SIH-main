/**
 * 🇮🇳 BHARAT SAFE YATRA — FRANKFURTER ECB CURRENCY FALLBACK
 * Phase 9B: Open-source European Central Bank reference exchange rates
 */

import { ICurrencyProvider, CurrencyExchangeResult } from '../types';

export class FrankfurterProvider implements ICurrencyProvider {
  name = 'Frankfurter-ECB';

  async getExchangeRates(baseCurrency = 'INR'): Promise<Record<string, number> | null> {
    try {
      const res = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency.toUpperCase()}`, {
        next: { revalidate: 86400 },
      });
      if (!res.ok) return null;

      const json = (await res.json()) as { rates?: Record<string, number> };
      return json.rates || null;
    } catch (err) {
      console.warn('[FrankfurterProvider] Fetch error:', err);
      return null;
    }
  }

  async convertCurrency(amount: number, fromCurrency = 'INR', toCurrency = 'USD'): Promise<CurrencyExchangeResult | null> {
    const rates = await this.getExchangeRates(fromCurrency.toUpperCase());
    if (!rates) return null;

    const rate = rates[toCurrency.toUpperCase()];
    if (typeof rate !== 'number') return null;

    return {
      baseCurrency: fromCurrency.toUpperCase(),
      targetCurrency: toCurrency.toUpperCase(),
      rate: Math.round(rate * 10000) / 10000,
      convertedAmount: Math.round(amount * rate * 100) / 100,
      metadata: {
        provider: 'Frankfurter (European Central Bank Reference)',
        source: 'ECB Daily Exchange Rates',
        retrievedAt: new Date().toISOString(),
        status: 'FALLBACK',
        isLive: true,
      },
    };
  }
}
