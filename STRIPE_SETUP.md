# Stripe Setup Guide for GatheredLight

## 1. Create Stripe Account
Go to https://dashboard.stripe.com and sign up (or use existing account).

## 2. Create Products & Prices
In Stripe Dashboard > Products, create:

### Family Plan ($9/month)
- Name: "GatheredLight Family"
- Price: $9.00/month recurring
- Copy the Price ID (starts with `price_`)

### Legacy Plan ($29/month)
- Name: "GatheredLight Legacy"
- Price: $29.00/month recurring
- Copy the Price ID (starts with `price_`)

## 3. Set Up Webhook
In Stripe Dashboard > Developers > Webhooks:
- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Copy the Webhook Signing Secret (starts with `whsec_`)

## 4. Update .env.local
```
STRIPE_SECRET_KEY=sk_test_...        # From Dashboard > Developers > API Keys
STRIPE_WEBHOOK_SECRET=whsec_...      # From webhook setup above
STRIPE_FAMILY_PRICE_ID=price_...     # Family plan price ID
STRIPE_LEGACY_PRICE_ID=price_...     # Legacy plan price ID
```

## 5. Supabase Migration
Run the migration in `supabase/migrations/002_billing.sql` to add billing columns to profiles table.

## 6. Customer Portal
In Stripe Dashboard > Settings > Billing > Customer portal:
- Enable subscription cancellation
- Enable plan switching
- Enable invoice history
- Set your return URL to `https://your-domain.com/dashboard`

## Testing
Use Stripe test mode (sk_test_* keys) and test card: `4242 4242 4242 4242`
