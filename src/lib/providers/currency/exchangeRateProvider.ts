/**
 * 🇮🇳 BHARAT SAFE YATRA — EXCHANGERATE-API PROVIDER (PRIMARY)
 * Phase 9B: Real Foreign Exchange Conversion for International Inbound Tourists
 */

import { ICurrencyProvider, CurrencyExchangeResult } from '../types';

export class ExchangeRateProvider implements ICurrencyProvider {
  name = 'ExchangeRate-API';

  async getExchangeRates(baseCurrency = 'INR'): Promise<Record<string, number> | null> {
    const apiKey = process.env.EXCHANGERATE_API_KEY;
    const url = apiKey && !apiKey.includes('your_')
      ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`
      : `https://open.er-api.com/v6/latest/${baseCurrency}`;

    try {
      const res = await fetch(url, { next: { revalidate: 86400 } });
      if (!res.ok) return null;

      const json = (await res.json()) as {
        result?: string;
        rates?: Record<string, number>;
        conversion_rates?: Record<string, number>;
      };

      return json.conversion_rates || json.rates || null;
    } catch (err) {
      console.warn('[ExchangeRateProvider] Error fetching rates:', err);
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
        provider: 'ExchangeRate-API Live Feeds',
        source: 'Global Central Bank Interbank Rates',
        retrievedAt: new Date().toISOString(),
        status: 'LIVE',
        isLive: true,
      },
    };
  }
}
