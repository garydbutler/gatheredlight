'use client';

import { useAuth, useTributes } from '@/lib/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import SubscriptionBanner from '@/components/SubscriptionBanner';
import { format } from 'date-fns';
import type { Tribute } from '@/lib/types';

function TributeCard({ tribute }: { tribute: Tribute }) {
  const dates = [
    tribute.born_date ? format(new Date(tribute.born_date), 'yyyy') : null,
    tribute.passed_date ? format(new Date(tribute.passed_date), 'yyyy') : null,
  ].filter(Boolean).join(' - ');

  return (
    <Link href={`/tributes/${tribute.id}`} className="card group">
      <div className="aspect-[16/10] bg-cream-100 relative overflow-hidden">
        {tribute.cover_photo_url ? (
          <img
            src={tribute.cover_photo_url}
            alt={tribute.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-cream-200">
            <span className="text-5xl font-serif text-amber-300">{tribute.name.charAt(0)}</span>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={`badge text-xs ${
            tribute.privacy === 'public' ? 'badge-sage' :
            tribute.privacy === 'family' ? 'badge-amber' : 'badge-earth'
          }`}>
            {tribute.privacy}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-serif text-earth-800 mb-1 group-hover:text-amber-600 transition-colors">
          {tribute.name}
        </h3>
        {dates && <p className="text-sm text-earth-400 mb-2">{dates}</p>}
        {tribute.bio && (
          <p className="text-sm text-earth-500 line-clamp-2">{tribute.bio}</p>
        )}
      </div>
    </Link>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { tributes, loading } = useTributes(user?.id);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sub, setSub] = useState<{ plan: string; status: string; currentPeriodEnd: string | null }>({
    plan: 'free', status: 'none', currentPeriodEnd: null,
  });
  const upgraded = searchParams.get('upgraded') === 'true';

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetch('/api/subscription').then(r => r.json()).then(setSub).catch(() => {});
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">
        {upgraded && (
          <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6 text-sage-700">
            Welcome to your upgraded plan! Your new features are now active.
          </div>
        )}

        <div className="mb-6">
          <SubscriptionBanner
            plan={sub.plan}
            status={sub.status}
            currentPeriodEnd={sub.currentPeriodEnd}
          />
        </div>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-serif text-earth-800">My Tributes</h1>
            <p className="text-earth-400 mt-1">Spaces you&apos;ve created to gather memories</p>
          </div>
          <Link href="/tributes/create" className="btn-primary">
            Create Tribute
          </Link>
        </div>

        {tributes.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <h2 className="text-2xl font-serif text-earth-700 mb-2">No tributes yet</h2>
            <p className="text-earth-400 mb-8 max-w-md mx-auto">
              Create your first tribute to start gathering memories with loved ones.
            </p>
            <Link href="/tributes/create" className="btn-primary">
              Create Your First Tribute
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tributes.map((t) => <TributeCard key={t.id} tribute={t} />)}
          </div>
        )}
      </div>
    </div>
  );
}
