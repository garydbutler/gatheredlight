'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function AddMemoryPage() {
  const router = useRouter();
  const params = useParams();
  const tributeId = params.id as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [type, setType] = useState<'story' | 'photo'>('story');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    content: '',
    memory_date: '',
    location: '',
  });

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setType('photo');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Please sign in first');

      let mediaUrl: string | null = null;

      // Upload photo if present
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `memories/${tributeId}/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('tribute-media')
          .upload(path, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('tribute-media')
          .getPublicUrl(path);

        mediaUrl = publicUrl;
      }

      // Find or create contributor record
      let contributorId: string | null = null;
      const { data: existing } = await supabase
        .from('contributors')
        .select('id')
        .eq('tribute_id', tributeId)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (existing) {
        contributorId = existing.id;
      } else {
        // Check if user is the creator (they don't need a contributor record for the policy)
        const { data: tribute } = await supabase
          .from('tributes')
          .select('creator_id')
          .eq('id', tributeId)
          .single();

        if (tribute && tribute.creator_id !== user.id) {
          throw new Error('You need to join this tribute first');
        }
      }

      const { error: insertError } = await supabase
        .from('memories')
        .insert({
          tribute_id: tributeId,
          contributor_id: contributorId,
          type,
          title: form.title || null,
          content: form.content || null,
          media_url: mediaUrl,
          memory_date: form.memory_date || null,
          location: form.location || null,
        });

      if (insertError) throw insertError;

      router.push(`/tributes/${tributeId}`);
      router.refresh();
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
          <Link href={`/tributes/${tributeId}`} className="text-earth-500 hover:text-earth-700 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <h1 className="text-xl font-serif text-earth-800">Share a Memory</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Type selector */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">What kind of memory?</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setType('story')}
                  className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                    type === 'story' ? 'border-amber-400 bg-amber-50' : 'border-cream-200 hover:border-cream-300'
                  }`}
                >
                  <svg className="w-6 h-6 mx-auto mb-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="text-sm font-medium text-earth-700">A Story</span>
                </button>
                <button
                  type="button"
                  onClick={() => setType('photo')}
                  className={`flex-1 p-4 rounded-xl border text-center transition-all ${
                    type === 'photo' ? 'border-amber-400 bg-amber-50' : 'border-cream-200 hover:border-cream-300'
                  }`}
                >
                  <svg className="w-6 h-6 mx-auto mb-2 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                  <span className="text-sm font-medium text-earth-700">A Photo</span>
                </button>
              </div>
            </div>

            {/* Photo upload */}
            {type === 'photo' && (
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">Upload a photo</label>
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden mb-3">
                    <img src={preview} alt="Preview" className="w-full max-h-64 object-cover" />
                    <button
                      type="button"
                      onClick={() => { setFile(null); setPreview(null); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-cream-300 rounded-xl cursor-pointer hover:border-amber-400 transition-colors">
                    <svg className="w-10 h-10 text-earth-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm text-earth-500">Click to choose a photo</span>
                    <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  </label>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => update('title', e.target.value)}
                className="input"
                placeholder="Give this memory a name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-earth-700 mb-1">
                {type === 'story' ? 'Your story' : 'Caption or story behind this photo'}
              </label>
              <textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                className="textarea h-40"
                placeholder={type === 'story'
                  ? 'Share your memory... What happened? What do you remember most?'
                  : 'What was happening in this photo? Why is it special?'
                }
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">When was this?</label>
                <input
                  type="date"
                  value={form.memory_date}
                  onChange={(e) => update('memory_date', e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-1">Where was this?</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  className="input"
                  placeholder="City, place, or landmark"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Sharing...' : 'Share Memory'}
              </button>
              <Link href={`/tributes/${tributeId}`} className="btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
