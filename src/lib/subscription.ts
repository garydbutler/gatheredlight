import { createServerSupabaseClient } from '@/lib/supabase/server';
import { PLANS, PlanKey } from '@/lib/stripe';

export interface UserSubscription {
  plan: PlanKey;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'none';
  currentPeriodEnd: string | null;
}

/**
 * Get the current user's subscription from the profiles table.
 * Falls back to 'free' if no subscription record exists.
 */
export async function getUserSubscription(): Promise<UserSubscription> {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      plan: 'free',
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      status: 'none',
      currentPeriodEnd: null,
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, stripe_customer_id, stripe_subscription_id, subscription_status, current_period_end')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return {
      plan: 'free',
      stripeCustomerId: null,
      stripeSubscriptionId: null,
      status: 'none',
      currentPeriodEnd: null,
    };
  }

  return {
    plan: (profile.plan as PlanKey) || 'free',
    stripeCustomerId: profile.stripe_customer_id,
    stripeSubscriptionId: profile.stripe_subscription_id,
    status: profile.subscription_status || 'none',
    currentPeriodEnd: profile.current_period_end,
  };
}

/**
 * Check if the user's plan allows a specific feature.
 */
export function canAccess(plan: PlanKey, feature: keyof typeof PLANS.free.limits): boolean {
  const limits = PLANS[plan]?.limits;
  if (!limits) return false;
  const value = limits[feature];
  if (typeof value === 'boolean') return value;
  return value > 0;
}

/**
 * Check if user has reached their tribute limit.
 */
export async function hasReachedTributeLimit(plan: PlanKey): Promise<boolean> {
  const limit = PLANS[plan].limits.tributes;
  if (limit === Infinity) return false;

  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return true;

  const { count } = await supabase
    .from('tributes')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', user.id);

  return (count || 0) >= limit;
}
