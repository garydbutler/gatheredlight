'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks';

function JoinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { data: tribute } = await supabase
      .from('tributes')
      .select('id, name')
      .eq('invite_code', code.trim())
      .single();

    if (!tribute) {
      setError('No tribute found with that invite code.');
      setLoading(false);
      return;
    }

    if (user) {
      const { data: existing } = await supabase
        .from('contributors')
        .select('id')
        .eq('tribute_id', tribute.id)
        .eq('user_id', user.id)
        .single();

      if (!existing) {
        await supabase.from('contributors').insert({
          tribute_id: tribute.id,
          user_id: user.id,
          name: name || user.user_metadata?.full_name || user.email || 'Contributor',
          relationship,
          status: 'active',
        });
      }
    }

    router.push(`/tributes/${tribute.id}`);
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-serif text-earth-800 text-center mb-2">Join a Tribute</h1>
      <p className="text-earth-400 text-center mb-8">Enter your invite code to contribute memories</p>
      <form onSubmit={handleJoin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-earth-600 mb-1.5">Invite Code</label>
          <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="input text-center text-lg font-mono tracking-widest" placeholder="Enter code" required />
        </div>
        {!user && (
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your name" required />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-earth-600 mb-1.5">Your Relationship</label>
          <input type="text" value={relationship} onChange={(e) => setRelationship(e.target.value)} className="input" placeholder="e.g., Grandson, Friend, Colleague" />
        </div>
        {error && <p className="text-rose-warm text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Joining...' : 'Join Tribute'}
        </button>
      </form>
      {!user && (
        <p className="text-center text-sm text-earth-400 mt-6">
          <Link href="/auth" className="text-amber-600 hover:text-amber-700">Sign in</Link> to save your contributions
        </p>
      )}
    </div>
  );
}

export default function JoinPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-10">
          <span className="font-serif text-3xl text-earth-800 tracking-tight">
            Gathered<span className="text-amber-500">Light</span>
          </span>
        </Link>
        <Suspense fallback={<div className="card p-8 text-center text-earth-400">Loading...</div>}>
          <JoinForm />
        </Suspense>
      </div>
    </div>
  );
}
