-- Add billing columns to profiles table
-- Run this after the initial profiles table exists

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status text DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

-- Index for webhook lookups
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON profiles(stripe_customer_id);

-- RLS: users can read their own billing info
-- (Assumes RLS is already enabled on profiles)
