'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useTribute, useAuth } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';

export default function SettingsPage() {
  const { id } = useParams<{ id: string }>();
  const { tribute, loading } = useTribute(id);
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', bio: '', privacy: 'private' as string });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (tribute) {
      setForm({ name: tribute.name, bio: tribute.bio || '', privacy: tribute.privacy });
    }
  }, [tribute]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.from('tributes').update(form).eq('id', id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleDelete() {
    if (!confirm('Are you sure? This will permanently delete this tribute and all its memories.')) return;
    await supabase.from('tributes').delete().eq('id', id);
    router.push('/dashboard');
  }

  if (loading) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif text-earth-800 mb-10">Tribute Settings</h1>

        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="textarea"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-3">Privacy</label>
            <select
              value={form.privacy}
              onChange={(e) => setForm({ ...form, privacy: e.target.value })}
              className="input"
            >
              <option value="private">Private - Invite only</option>
              <option value="family">Family Only</option>
              <option value="public">Public</option>
            </select>
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saved ? 'Saved!' : saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>

        <div className="mt-16 pt-8 border-t border-cream-200">
          <h2 className="font-serif text-xl text-rose-warm mb-4">Danger Zone</h2>
          <p className="text-earth-400 text-sm mb-4">
            Deleting a tribute removes all memories, contributors, and photos permanently.
          </p>
          <button onClick={handleDelete} className="px-6 py-3 rounded-xl bg-rose-warm/10 text-rose-warm hover:bg-rose-warm/20 font-medium transition-colors">
            Delete Tribute
          </button>
        </div>
      </div>
    </div>
  );
}
