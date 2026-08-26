/**
 * 🇮🇳 BHARAT SAFE YATRA — PAYMENT SERVICE ORCHESTRATOR
 * Phase 9B: Razorpay Domestic Payment Gateway Integration
 */

import { RazorpayProvider } from './razorpayProvider';
import { PaymentOrderParams, PaymentOrderResult, PaymentVerificationParams } from '../types';

const razorpay = new RazorpayProvider();

export async function createPaymentOrder(params: PaymentOrderParams): Promise<PaymentOrderResult> {
  return razorpay.createOrder(params);
}

export function verifyPayment(params: PaymentVerificationParams): boolean {
  return razorpay.verifyPaymentSignature(params);
}
