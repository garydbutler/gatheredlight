'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function JoinForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  const [code, setCode] = useState(searchParams.get('code') || '');
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tribute, setTribute] = useState<any>(null);
  const [step, setStep] = useState<'code' | 'details'>('code');

  async function lookupCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/auth?mode=signup&next=/join?code=${code}`);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('tributes')
        .select('id, name, born_date, passed_date, bio')
        .eq('invite_code', code.trim().toLowerCase())
        .single();

      if (fetchError || !data) throw new Error('Invalid invite code. Please check and try again.');

      setTribute(data);
      setStep('details');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function joinTribute(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first');

      // Check if already a contributor
      const { data: existing } = await supabase
        .from('contributors')
        .select('id, status')
        .eq('tribute_id', tribute.id)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        if (existing.status === 'active') {
          router.push(`/tributes/${tribute.id}`);
          return;
        }
        // Reactivate
        await supabase
          .from('contributors')
          .update({ status: 'active', name })
          .eq('id', existing.id);
      } else {
        const { error: insertError } = await supabase
          .from('contributors')
          .insert({
            tribute_id: tribute.id,
            user_id: user.id,
            name: name || user.user_metadata?.full_name || 'Anonymous',
            relationship: relationship || null,
            status: 'active',
          });

        if (insertError) throw insertError;
      }

      router.push(`/tributes/${tribute.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-2xl text-earth-800 tracking-tight">
            Gathered<span className="text-amber-500">Light</span>
          </Link>
          <p className="text-earth-500 mt-2">
            {step === 'code' ? 'Enter your invite code' : `Join the tribute for ${tribute?.name}`}
          </p>
        </div>

        {step === 'code' ? (
          <form onSubmit={lookupCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Invite code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input text-center font-mono text-xl tracking-widest"
                placeholder="abc12def"
                required
                maxLength={12}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Looking up...' : 'Find Tribute'}
            </button>
          </form>
        ) : (
          <>
            {/* Tribute preview */}
            <div className="bg-cream-50 border border-cream-200 rounded-xl p-5 mb-6 text-center">
              <h3 className="text-xl font-serif text-earth-800 mb-1">{tribute.name}</h3>
              {tribute.bio && (
                <p className="text-sm text-earth-500 italic">{tribute.bio.slice(0, 120)}</p>
              )}
            </div>

            <form onSubmit={joinTribute} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Your name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="How they knew you"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Your relationship</label>
                <input
                  type="text"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="input"
                  placeholder="Friend, cousin, neighbor..."
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? 'Joining...' : 'Join Tribute'}
              </button>

              <button
                type="button"
                onClick={() => { setStep('code'); setTribute(null); }}
                className="btn-ghost w-full text-sm"
              >
                Use a different code
              </button>
            </form>
          </>
        )}

        <div className="text-center mt-6">
          <Link href="/dashboard" className="text-sm text-earth-500 hover:text-earth-700 transition-colors">
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-earth-500">Loading...</p></div>}>
      <JoinForm />
    </Suspense>
  );
}
