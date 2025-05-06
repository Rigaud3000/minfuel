/**
 * Stripe Payment Service
 * 
 * This service handles interactions with Stripe for payment processing and subscription management
 */

import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define plan types and their corresponding price IDs
// In a real implementation, these would be stored in the database
export enum SubscriptionPlan {
  PRO_MONTHLY = 'pro-monthly',
  PRO_ANNUAL = 'pro-annual',
  PREMIUM_MONTHLY = 'premium-monthly',
  PREMIUM_ANNUAL = 'premium-annual'
}

// Price IDs should match those created in the Stripe dashboard
// These are placeholder values - in a production app, you would use real Stripe price IDs
const PRICE_IDS: Record<SubscriptionPlan, string> = {
  [SubscriptionPlan.PRO_MONTHLY]: 'price_pro_monthly',
  [SubscriptionPlan.PRO_ANNUAL]: 'price_pro_annual',
  [SubscriptionPlan.PREMIUM_MONTHLY]: 'price_premium_monthly',
  [SubscriptionPlan.PREMIUM_ANNUAL]: 'price_premium_annual'
};

/**
 * Create a new customer in Stripe
 * @param email Customer's email address
 * @param name Customer's name
 * @returns Stripe Customer object
 */
export async function createCustomer(email: string, name: string): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'MindFuel App'
      }
    });
    
    return customer;
  } catch (error: any) {
    console.error('Error creating Stripe customer:', error.message);
    throw new Error(`Failed to create customer: ${error.message}`);
  }
}

/**
 * Create a subscription for a customer
 * @param customerId Stripe customer ID
 * @param planType Subscription plan type
 * @returns Object containing subscription and payment intent info
 */
export async function createSubscription(customerId: string, planType: SubscriptionPlan): Promise<{ 
  subscriptionId: string;
  clientSecret: string | null;
}> {
  try {
    const priceId = PRICE_IDS[planType];
    
    if (!priceId) {
      throw new Error(`Invalid plan type: ${planType}`);
    }
    
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
    });
    
    // Create a separate payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00 as an example, would be based on plan price
      currency: 'usd',
      customer: customerId,
      setup_future_usage: 'off_session',
    });
    
    return {
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.error('Error creating Stripe subscription:', error.message);
    throw new Error(`Failed to create subscription: ${error.message}`);
  }
}

/**
 * Cancel a subscription
 * @param subscriptionId Stripe subscription ID
 * @returns Stripe Subscription object
 */
export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.cancel(subscriptionId);
  } catch (error: any) {
    console.error('Error canceling Stripe subscription:', error.message);
    throw new Error(`Failed to cancel subscription: ${error.message}`);
  }
}

/**
 * Get subscription details
 * @param subscriptionId Stripe subscription ID
 * @returns Stripe Subscription object
 */
export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error: any) {
    console.error('Error retrieving Stripe subscription:', error.message);
    throw new Error(`Failed to retrieve subscription: ${error.message}`);
  }
}

/**
 * Create a Stripe Checkout session for one-time payments
 * @param customerId Stripe customer ID
 * @param amount Amount in cents
 * @param description Payment description
 * @returns Checkout session
 */
export async function createCheckoutSession(
  customerId: string, 
  amount: number, 
  description: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  try {
    return await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MindFuel Premium Access',
              description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  } catch (error: any) {
    console.error('Error creating Stripe checkout session:', error.message);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

/**
 * Create a payment intent for a one-time payment
 * @param amount Amount in cents
 * @param customerId Stripe customer ID (optional)
 * @returns Payment Intent
 */
export async function createPaymentIntent(amount: number, customerId?: string): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    };
    
    if (customerId) {
      paymentIntentData.customer = customerId;
    }
    
    return await stripe.paymentIntents.create(paymentIntentData);
  } catch (error: any) {
    console.error('Error creating Stripe payment intent:', error.message);
    throw new Error(`Failed to create payment intent: ${error.message}`);
  }
}

export default {
  createCustomer,
  createSubscription,
  cancelSubscription,
  getSubscription,
  createCheckoutSession,
  createPaymentIntent,
};