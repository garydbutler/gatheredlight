'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function NewTributePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    born_date: '',
    passed_date: '',
    bio: '',
    privacy: 'private' as 'public' | 'private' | 'family',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first');

      const { data, error: insertError } = await supabase
        .from('tributes')
        .insert({
          creator_id: user.id,
          name: form.name,
          born_date: form.born_date || null,
          passed_date: form.passed_date || null,
          bio: form.bio || null,
          privacy: form.privacy,
        })
        .select()
        .single();

      if (insertError) throw insertError;
      router.push(`/tributes/${data.id}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-cream-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-earth-500 hover:text-earth-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-serif text-earth-800">Create a Tribute</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="card p-8">
          <p className="text-earth-500 mb-8 leading-relaxed">
            Honor someone special by creating a tribute. You can invite family and friends
            to share their memories, photos, and stories.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                Who is this tribute for? *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="input"
                placeholder="Their full name"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Date of birth</label>
                <input
                  type="date"
                  value={form.born_date}
                  onChange={(e) => update('born_date', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Date of passing</label>
                <input
                  type="date"
                  value={form.passed_date}
                  onChange={(e) => update('passed_date', e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                About them
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => update('bio', e.target.value)}
                className="textarea h-32"
                placeholder="A few words about who they were and what they meant to you..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">Privacy</label>
              <div className="space-y-3">
                {[
                  { value: 'private', label: 'Private', desc: 'Only invited contributors can see this tribute' },
                  { value: 'family', label: 'Family', desc: 'Visible to anyone with the invite code' },
                  { value: 'public', label: 'Public', desc: 'Anyone can view this tribute' },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      form.privacy === opt.value
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-cream-200 hover:border-cream-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={opt.value}
                      checked={form.privacy === opt.value}
                      onChange={(e) => update('privacy', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-medium text-earth-700">{opt.label}</span>
                      <p className="text-sm text-earth-500">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Tribute'}
              </button>
              <Link href="/dashboard" className="btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
