'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get('mode') === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
    }
    router.push('/dashboard');
  }

  return (
    <div className="card p-8">
      <h1 className="text-2xl font-serif text-earth-800 text-center mb-2">
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h1>
      <p className="text-earth-400 text-center mb-8">
        {isSignUp ? 'Start preserving precious memories' : 'Continue where you left off'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Your full name" required />
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-earth-600 mb-1.5">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="you@example.com" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-earth-600 mb-1.5">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="At least 6 characters" minLength={6} required />
        </div>
        {error && <p className="text-rose-warm text-sm text-center">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <button onClick={() => setIsSignUp(!isSignUp)} className="text-amber-600 hover:text-amber-700 text-sm font-medium">
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="block text-center mb-10">
          <span className="font-serif text-3xl text-earth-800 tracking-tight">
            Gathered<span className="text-amber-500">Light</span>
          </span>
        </Link>
        <Suspense fallback={<div className="card p-8 text-center text-earth-400">Loading...</div>}>
          <AuthForm />
        </Suspense>
      </div>
    </div>
  );
}
