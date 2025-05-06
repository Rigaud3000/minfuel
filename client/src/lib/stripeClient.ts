import { apiRequest } from './queryClient';

// Customer management
export async function createStripeCustomer(name: string, email: string) {
  const response = await apiRequest('POST', '/api/subscription/create-customer', { name, email });
  return response.json();
}

// Subscription management
export async function createSubscription(customerId: string, planType: string) {
  const response = await apiRequest('POST', '/api/subscription/create', { customerId, planType });
  return response.json();
}

export async function cancelSubscription(subscriptionId: string) {
  const response = await apiRequest('POST', '/api/subscription/cancel', { subscriptionId });
  return response.json();
}

export async function getSubscription(subscriptionId: string) {
  const response = await apiRequest('GET', `/api/subscription/${subscriptionId}`);
  return response.json();
}

// Payment management
export async function createPaymentIntent(amount: number, customerId?: string) {
  const response = await apiRequest('POST', '/api/payment/create-intent', { 
    amount, 
    customerId 
  });
  return response.json();
}

export async function createCheckoutSession(
  customerId: string,
  amount: number,
  description: string,
  successUrl: string,
  cancelUrl: string
) {
  const response = await apiRequest('POST', '/api/payment/create-checkout', {
    customerId,
    amount,
    description,
    successUrl,
    cancelUrl
  });
  return response.json();
}

// Subscription plan types matching server enum
export enum SubscriptionPlan {
  PRO_MONTHLY = 'pro-monthly',
  PRO_ANNUAL = 'pro-annual',
  PREMIUM_MONTHLY = 'premium-monthly',
  PREMIUM_ANNUAL = 'premium-annual'
}

// Map local plan IDs to server-side plan types
export function mapPlanIdToSubscriptionPlan(planId: string): SubscriptionPlan | null {
  switch (planId) {
    case 'pro-monthly':
      return SubscriptionPlan.PRO_MONTHLY;
    case 'pro-annual':
      return SubscriptionPlan.PRO_ANNUAL;
    case 'premium-monthly':
      return SubscriptionPlan.PREMIUM_MONTHLY;
    case 'premium-annual':
      return SubscriptionPlan.PREMIUM_ANNUAL;
    default:
      return null;
  }
}