import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
  typescript: true,
});

// Price IDs from Stripe Dashboard - set these in .env.local
export const PLANS = {
  free: {
    name: 'Free',
    priceId: null,
    limits: {
      tributes: 1,
      contributors: 5,
      memories: 50,
      slideshow: false,
      export: false,
      aiPrompts: false,
      customThemes: false,
    },
  },
  family: {
    name: 'Family',
    priceId: process.env.STRIPE_FAMILY_PRICE_ID || '',
    limits: {
      tributes: 5,
      contributors: Infinity,
      memories: Infinity,
      slideshow: true,
      export: true,
      aiPrompts: false,
      customThemes: false,
    },
  },
  legacy: {
    name: 'Legacy',
    priceId: process.env.STRIPE_LEGACY_PRICE_ID || '',
    limits: {
      tributes: Infinity,
      contributors: Infinity,
      memories: Infinity,
      slideshow: true,
      export: true,
      aiPrompts: true,
      customThemes: true,
    },
  },
} as const;

export type PlanKey = keyof typeof PLANS;
