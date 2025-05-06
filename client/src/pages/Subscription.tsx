import { useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { mapPlanIdToSubscriptionPlan, createStripeCustomer, createSubscription } from '@/lib/stripeClient';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingPeriod: 'monthly' | 'annual';
  description: string;
  features: PlanFeature[];
  popular?: boolean;
  savings?: number;
}

export default function Subscription() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  // Subscription plans data
  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      billingPeriod: 'monthly',
      description: 'Basic features to start your clean eating journey',
      features: [
        { name: 'Daily challenges', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Community leaderboard', included: true },
        { name: 'Basic health tips', included: true },
        { name: 'Limited AI coaching (5 messages/day)', included: true },
        { name: 'Food scanner (3 scans/day)', included: true },
        { name: 'Ad-free experience', included: false },
        { name: 'Premium challenges', included: false },
        { name: 'Personalized meal plans', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited AI coaching', included: false },
        { name: 'Unlimited food scanning', included: false },
      ]
    },
    {
      id: 'pro-monthly',
      name: 'Pro',
      price: 9.99,
      billingPeriod: 'monthly',
      description: 'Enhanced features for committed clean eaters',
      features: [
        { name: 'Daily challenges', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Community leaderboard', included: true },
        { name: 'Basic health tips', included: true },
        { name: 'Limited AI coaching (5 messages/day)', included: true },
        { name: 'Food scanner (3 scans/day)', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Premium challenges', included: true },
        { name: 'Personalized meal plans', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited AI coaching', included: false },
        { name: 'Unlimited food scanning', included: false },
      ],
      popular: true
    },
    {
      id: 'pro-annual',
      name: 'Pro',
      price: 99.99,
      billingPeriod: 'annual',
      description: 'Enhanced features for committed clean eaters',
      features: [
        { name: 'Daily challenges', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Community leaderboard', included: true },
        { name: 'Basic health tips', included: true },
        { name: 'Limited AI coaching (5 messages/day)', included: true },
        { name: 'Food scanner (3 scans/day)', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Premium challenges', included: true },
        { name: 'Personalized meal plans', included: true },
        { name: 'Advanced analytics', included: false },
        { name: 'Unlimited AI coaching', included: false },
        { name: 'Unlimited food scanning', included: false },
      ],
      popular: true,
      savings: 20 // Percentage saved compared to monthly
    },
    {
      id: 'premium-monthly',
      name: 'Premium',
      price: 19.99,
      billingPeriod: 'monthly',
      description: 'Full access to all MindFuel features',
      features: [
        { name: 'Daily challenges', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Community leaderboard', included: true },
        { name: 'Basic health tips', included: true },
        { name: 'Limited AI coaching (5 messages/day)', included: true },
        { name: 'Food scanner (3 scans/day)', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Premium challenges', included: true },
        { name: 'Personalized meal plans', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Unlimited AI coaching', included: true },
        { name: 'Unlimited food scanning', included: true },
      ]
    },
    {
      id: 'premium-annual',
      name: 'Premium',
      price: 199.99,
      billingPeriod: 'annual',
      description: 'Full access to all MindFuel features',
      features: [
        { name: 'Daily challenges', included: true },
        { name: 'Progress tracking', included: true },
        { name: 'Community leaderboard', included: true },
        { name: 'Basic health tips', included: true },
        { name: 'Limited AI coaching (5 messages/day)', included: true },
        { name: 'Food scanner (3 scans/day)', included: true },
        { name: 'Ad-free experience', included: true },
        { name: 'Premium challenges', included: true },
        { name: 'Personalized meal plans', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Unlimited AI coaching', included: true },
        { name: 'Unlimited food scanning', included: true },
      ],
      savings: 17 // Percentage saved compared to monthly
    }
  ];

  // Initialize Stripe with public key
  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  
  // Handle subscription selection
  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    const plan = plans.find(p => p.id === planId);
    if (plan && plan.price > 0) {
      // Set the current plan for payment processing
      setCurrentPlan(plan);
      // Open payment modal
      setPaymentModalOpen(true);
    }
  };

  // Filter plans based on billing period
  const filteredPlans = plans.filter(plan => 
    plan.id === 'free' || plan.billingPeriod === billingPeriod
  );
  
  // Payment form component
  const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!stripe || !elements || !currentPlan) {
        return;
      }
      
      setProcessingPayment(true);
      setError(null);
      
      try {
        // Step 1: Create a customer
        const { customerId } = await createStripeCustomer(name, email);
        
        if (!customerId) {
          throw new Error('Failed to create customer');
        }
        
        // Step 2: Create a subscription
        const planType = mapPlanIdToSubscriptionPlan(currentPlan.id);
        
        if (!planType) {
          throw new Error('Invalid plan selected');
        }
        
        const { subscriptionId, clientSecret } = await createSubscription(customerId, planType);
        
        if (!clientSecret) {
          throw new Error('Failed to create subscription');
        }
        
        // Step 3: Confirm the payment
        const cardElement = elements.getElement(CardElement);
        
        if (!cardElement) {
          throw new Error('Card element not found');
        }
        
        const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name,
              email,
            },
          },
        });
        
        if (paymentError) {
          throw new Error(paymentError.message);
        }
        
        // Success
        toast({
          title: "Subscription Active",
          description: `Your ${currentPlan.name} subscription is now active!`,
        });
        
        setPaymentModalOpen(false);
      } catch (err: any) {
        console.error('Payment error:', err);
        setError(err.message || 'An unexpected error occurred');
        toast({
          title: "Payment Failed",
          description: err.message || 'An unexpected error occurred',
          variant: "destructive",
        });
      } finally {
        setProcessingPayment(false);
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Name
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-900 border border-accent rounded-md"
              required
            />
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Email
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-900 border border-accent rounded-md"
              required
            />
          </label>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Card Details
            <div className="mt-1 p-3 bg-gray-900 border border-accent rounded-md">
              <CardElement options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#FFFFFF',
                    '::placeholder': {
                      color: '#999999',
                    },
                  },
                  invalid: {
                    color: '#EF4444',
                  },
                },
              }} />
            </div>
          </label>
        </div>
        
        {error && (
          <div className="text-red-400 text-sm p-2 bg-red-900/20 border border-red-800 rounded">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full bg-secondary text-black hover:bg-secondary/90" 
          disabled={!stripe || processingPayment}
        >
          {processingPayment ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Processing...
            </>
          ) : (
            `Pay $${currentPlan?.price || 0} ${currentPlan?.billingPeriod === 'annual' ? 'annually' : 'monthly'}`
          )}
        </Button>
      </form>
    );
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold">{t.navigation.subscription}</h1>
        <p className="text-gray-400 mt-1">Choose the plan that fits your needs</p>
      </div>
      
      <div className="flex justify-center mb-6">
        <div className="bg-card rounded-lg p-1 flex">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              billingPeriod === 'monthly' 
                ? 'bg-secondary text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setBillingPeriod('monthly')}
          >
            Monthly
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
              billingPeriod === 'annual' 
                ? 'bg-secondary text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setBillingPeriod('annual')}
          >
            Annual
            <Badge variant="outline" className="ml-2 bg-green-900/40 text-green-400 border-green-600 font-normal">
              Save up to 20%
            </Badge>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {filteredPlans.map((plan) => (
          <Card 
            key={plan.id}
            className={`relative border ${
              plan.popular 
                ? 'border-secondary' 
                : 'border-accent'
            } bg-card hover:bg-card/80 transition-colors`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-secondary text-black">Most Popular</Badge>
              </div>
            )}
            
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription className="min-h-[40px]">{plan.description}</CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  {plan.price > 0 && (
                    <span className="text-sm text-gray-400 ml-1">
                      /{plan.billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                
                {plan.savings && (
                  <div className="text-sm text-green-400 mt-1">
                    Save {plan.savings}% with annual billing
                  </div>
                )}
              </div>
              
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li 
                    key={index}
                    className={`flex items-start text-sm ${
                      feature.included ? 'text-gray-300' : 'text-gray-500'
                    }`}
                  >
                    <span className="mr-2 mt-0.5">
                      {feature.included ? (
                        <i className="ri-check-line text-green-500"></i>
                      ) : (
                        <i className="ri-close-line text-gray-500"></i>
                      )}
                    </span>
                    {feature.name}
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button
                className={`w-full ${
                  plan.price > 0
                    ? 'bg-secondary hover:bg-secondary/90 text-black'
                    : 'bg-accent hover:bg-accent/90'
                }`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 bg-card border border-accent rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Subscription Benefits</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="bg-secondary/20 p-3 rounded-full mr-4">
              <i className="ri-ai-generate text-secondary text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-lg">Advanced AI Coaching</h3>
              <p className="text-gray-400 text-sm">Get personalized nutrition advice and meal suggestions from our advanced AI coach, trained on the latest nutritional science.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-secondary/20 p-3 rounded-full mr-4">
              <i className="ri-camera-3-line text-secondary text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-lg">Unlimited Food Scanner</h3>
              <p className="text-gray-400 text-sm">Scan any food item to get instant nutritional information, sugar content analysis, and healthier alternative suggestions.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-secondary/20 p-3 rounded-full mr-4">
              <i className="ri-trophy-line text-secondary text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-lg">Exclusive Challenges</h3>
              <p className="text-gray-400 text-sm">Access premium challenges designed by nutrition experts to accelerate your clean eating journey and build lasting habits.</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-secondary/20 p-3 rounded-full mr-4">
              <i className="ri-file-chart-line text-secondary text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-lg">Advanced Analytics</h3>
              <p className="text-gray-400 text-sm">Gain deeper insights into your health journey with detailed analytics, personalized recommendations, and progress projections.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>You can cancel your subscription at any time from your profile settings.</p>
        <p className="mt-2">By subscribing, you agree to our Terms of Service and Privacy Policy.</p>
      </div>
      
      {/* Payment Modal */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribe to {currentPlan?.name}</DialogTitle>
            <DialogDescription>
              {currentPlan?.billingPeriod === 'monthly'
                ? `You'll be charged $${currentPlan?.price} monthly.`
                : `You'll be charged $${currentPlan?.price} annually.`
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <Elements stripe={stripePromise}>
              <CheckoutForm />
            </Elements>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}