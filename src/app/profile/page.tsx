'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState(user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (loading) return null;
  if (!user) { router.push('/auth'); return null; }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.auth.updateUser({ data: { full_name: name } });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif text-earth-800 mb-10">Your Profile</h1>

        <div className="card p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-2xl font-serif text-amber-600">
                {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-earth-700">{user.user_metadata?.full_name || 'No name set'}</p>
              <p className="text-sm text-earth-400">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-earth-600 mb-1.5">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-600 mb-1.5">Email</label>
              <input type="email" value={user.email || ''} className="input bg-cream-100" disabled />
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
