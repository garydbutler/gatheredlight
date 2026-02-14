'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase, uploadMedia } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks';

export default function AddMemoryPage() {
  const { id: tributeId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    type: 'story' as 'story' | 'photo',
    title: '',
    content: '',
    memory_date: '',
    location: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      if (!form.type || form.type === 'story') {
        setForm({ ...form, type: 'photo' });
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    // Find contributor record
    const { data: contributor } = await supabase
      .from('contributors')
      .select('id')
      .eq('tribute_id', tributeId)
      .eq('user_id', user.id)
      .single();

    let media_url: string | undefined;
    if (file) {
      const url = await uploadMedia(file, tributeId);
      if (url) media_url = url;
    }

    const { error } = await supabase.from('memories').insert({
      tribute_id: tributeId,
      contributor_id: contributor?.id,
      type: form.type,
      title: form.title || null,
      content: form.content || null,
      media_url: media_url || null,
      memory_date: form.memory_date || null,
      location: form.location || null,
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    router.push(`/tributes/${tributeId}`);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <button onClick={() => router.back()} className="text-sm text-earth-400 hover:text-earth-600 mb-6 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to tribute
        </button>

        <h1 className="text-3xl font-serif text-earth-800 mb-2">Share a Memory</h1>
        <p className="text-earth-400 mb-10">Every story, every photo is a gift to those who gather here.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type toggle */}
          <div className="flex gap-2">
            {(['story', 'photo'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t })}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  form.type === t
                    ? 'bg-amber-500 text-white'
                    : 'bg-cream-100 text-earth-500 hover:bg-cream-200'
                }`}
              >
                {t === 'story' ? 'Write a Story' : 'Share a Photo'}
              </button>
            ))}
          </div>

          {/* Photo upload */}
          {form.type === 'photo' && (
            <label className="block cursor-pointer">
              <div className="aspect-video rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50 overflow-hidden hover:border-amber-300 transition-colors">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-earth-400">
                    <svg className="w-10 h-10 mb-2 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <span className="text-sm">Click to upload a photo</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="input"
              placeholder={form.type === 'story' ? 'Give your story a title...' : 'What is this photo of?'}
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">
              {form.type === 'story' ? 'Your Story' : 'Caption or Story'}
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="textarea"
              rows={form.type === 'story' ? 10 : 4}
              placeholder="Share your memory..."
            />
          </div>

          {/* Date & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-600 mb-1.5">When was this?</label>
              <input
                type="date"
                value={form.memory_date}
                onChange={(e) => setForm({ ...form, memory_date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-600 mb-1.5">Where?</label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="input"
                placeholder="e.g., Grandma's kitchen"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4">
            {loading ? 'Sharing...' : 'Share This Memory'}
          </button>
        </form>
      </div>
    </div>
  );
}
