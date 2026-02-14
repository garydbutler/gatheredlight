'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase, uploadMedia } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks';

export default function CreateTributePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    born_date: '',
    passed_date: '',
    bio: '',
    privacy: 'private' as 'public' | 'private' | 'family',
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function handleCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setPreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    let cover_photo_url: string | undefined;

    // Create tribute first to get ID for storage path
    const { data, error } = await supabase
      .from('tributes')
      .insert({ ...form, creator_id: user.id })
      .select()
      .single();

    if (error || !data) {
      console.error(error);
      setLoading(false);
      return;
    }

    if (coverFile) {
      const url = await uploadMedia(coverFile, data.id);
      if (url) {
        await supabase.from('tributes').update({ cover_photo_url: url }).eq('id', data.id);
      }
    }

    // Also add creator as a contributor
    await supabase.from('contributors').insert({
      tribute_id: data.id,
      user_id: user.id,
      name: user.user_metadata?.full_name || user.email || 'Creator',
      relationship: 'Creator',
      status: 'active',
    });

    router.push(`/tributes/${data.id}`);
  }

  const privacyOptions = [
    { value: 'private', label: 'Private', desc: 'Only invited people can see' },
    { value: 'family', label: 'Family Only', desc: 'Family members with the link' },
    { value: 'public', label: 'Public', desc: 'Anyone can view the tribute' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif text-earth-800 mb-2">Create a Tribute</h1>
        <p className="text-earth-400 mb-10">
          Honor someone special by creating a space for shared memories.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover Photo */}
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-2">Cover Photo</label>
            <label className="block cursor-pointer">
              <div className="aspect-[16/7] rounded-2xl border-2 border-dashed border-cream-300 bg-cream-50 overflow-hidden hover:border-amber-300 transition-colors relative">
                {preview ? (
                  <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-earth-400">
                    <svg className="w-10 h-10 mb-2 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                    <span className="text-sm">Click to upload a cover photo</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleCover} className="hidden" />
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">
              Name of the person you&apos;re honoring
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input text-lg"
              placeholder="Their full name"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-earth-600 mb-1.5">Born</label>
              <input
                type="date"
                value={form.born_date}
                onChange={(e) => setForm({ ...form, born_date: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-earth-600 mb-1.5">Passed</label>
              <input
                type="date"
                value={form.passed_date}
                onChange={(e) => setForm({ ...form, passed_date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-1.5">About them</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="textarea"
              rows={4}
              placeholder="Share a few words about who they were..."
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-earth-600 mb-3">Privacy</label>
            <div className="grid grid-cols-3 gap-3">
              {privacyOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm({ ...form, privacy: opt.value as typeof form.privacy })}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    form.privacy === opt.value
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-cream-200 bg-cream-50 hover:border-cream-300'
                  }`}
                >
                  <p className="font-medium text-earth-700 text-sm">{opt.label}</p>
                  <p className="text-xs text-earth-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full text-lg py-4">
            {loading ? 'Creating...' : 'Create Tribute'}
          </button>
        </form>
      </div>
    </div>
  );
}
