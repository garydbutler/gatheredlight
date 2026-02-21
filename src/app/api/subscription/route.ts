import { NextResponse } from 'next/server';
import { getUserSubscription } from '@/lib/subscription';

export async function GET() {
  try {
    const sub = await getUserSubscription();
    return NextResponse.json(sub);
  } catch (error) {
    console.error('Subscription fetch error:', error);
    return NextResponse.json(
      { plan: 'free', status: 'none', stripeCustomerId: null, stripeSubscriptionId: null, currentPeriodEnd: null }
    );
  }
}
