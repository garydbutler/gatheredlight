'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Props {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
}

export default function SubscriptionBanner({ plan, status, currentPeriodEnd }: Props) {
  const [loading, setLoading] = useState(false);

  async function openPortal() {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setLoading(false);
    }
  }

  if (plan === 'free') {
    return (
      <div className="bg-cream-100 border border-cream-200 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-earth-700 font-medium">Free Plan</p>
          <p className="text-earth-500 text-sm">1 tribute, 5 contributors, 50 memories</p>
        </div>
        <Link href="/pricing" className="btn-primary text-sm">
          Upgrade
        </Link>
      </div>
    );
  }

  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const isPastDue = status === 'past_due';
  const isCanceled = status === 'canceled';
  const endDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null;

  return (
    <div className={`rounded-xl p-4 flex items-center justify-between ${
      isPastDue ? 'bg-red-50 border border-red-200' :
      isCanceled ? 'bg-amber-50 border border-amber-200' :
      'bg-sage-50 border border-sage-200'
    }`}>
      <div>
        <p className="text-earth-700 font-medium">
          {planLabel} Plan
          {isPastDue && <span className="text-red-600 ml-2 text-sm">(Payment Failed)</span>}
          {isCanceled && <span className="text-amber-600 ml-2 text-sm">(Canceled)</span>}
        </p>
        {endDate && (
          <p className="text-earth-500 text-sm">
            {isCanceled ? `Access until ${endDate}` : `Renews ${endDate}`}
          </p>
        )}
      </div>
      <button
        onClick={openPortal}
        disabled={loading}
        className="btn-secondary text-sm"
      >
        {loading ? 'Loading...' : 'Manage Billing'}
      </button>
    </div>
  );
}
