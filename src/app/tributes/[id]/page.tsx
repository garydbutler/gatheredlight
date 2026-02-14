'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MemoryWall from '@/components/MemoryWall';
import Timeline from '@/components/Timeline';
import StoriesView from '@/components/StoriesView';
import { useTribute, useMemories, useAuth } from '@/lib/hooks';
import { format } from 'date-fns';

type ViewMode = 'wall' | 'timeline' | 'stories';

export default function TributeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { tribute, loading: tLoading } = useTribute(id);
  const { memories, loading: mLoading } = useMemories(id);
  const { user } = useAuth();
  const [view, setView] = useState<ViewMode>('wall');

  const isCreator = user?.id === tribute?.creator_id;

  if (tLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!tribute) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-32">
          <h1 className="text-2xl font-serif text-earth-700">Tribute not found</h1>
        </div>
      </div>
    );
  }

  const dates = [
    tribute.born_date ? format(new Date(tribute.born_date), 'MMMM d, yyyy') : null,
    tribute.passed_date ? format(new Date(tribute.passed_date), 'MMMM d, yyyy') : null,
  ].filter(Boolean).join(' — ');

  const views: { key: ViewMode; label: string }[] = [
    { key: 'wall', label: 'Memory Wall' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'stories', label: 'Stories' },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-amber-100 to-cream-200 overflow-hidden">
        {tribute.cover_photo_url && (
          <img
            src={tribute.cover_photo_url}
            alt={tribute.name}
            className="w-full h-full object-cover kenburns-1"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">{tribute.name}</h1>
          {dates && <p className="text-cream-200 text-lg">{dates}</p>}
        </div>
      </div>

      {/* Action Bar */}
      <div className="border-b border-cream-200 bg-warm-white sticky top-[57px] z-40">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex gap-1">
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                  view === v.key
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-earth-400 hover:text-earth-600'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 py-2">
            <Link href={`/tributes/${id}/memories/add`} className="btn-primary text-sm py-2 px-4">
              Add Memory
            </Link>
            <Link href={`/tributes/${id}/slideshow`} className="btn-secondary text-sm py-2 px-4">
              Slideshow
            </Link>
            {isCreator && (
              <>
                <Link href={`/tributes/${id}/invite`} className="btn-ghost text-sm py-2 px-4">
                  Invite
                </Link>
                <Link href={`/tributes/${id}/settings`} className="btn-ghost text-sm py-2 px-4">
                  Settings
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {tribute.bio && (
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-earth-500 text-lg italic leading-relaxed">{tribute.bio}</p>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        {mLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-cream-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h2 className="text-xl font-serif text-earth-700 mb-2">No memories yet</h2>
            <p className="text-earth-400 mb-6">Be the first to share a memory of {tribute.name}.</p>
            <Link href={`/tributes/${id}/memories/add`} className="btn-primary">
              Share a Memory
            </Link>
          </div>
        ) : (
          <>
            {view === 'wall' && <MemoryWall memories={memories} tributeId={id} />}
            {view === 'timeline' && <Timeline memories={memories} tributeId={id} />}
            {view === 'stories' && <StoriesView memories={memories} tributeId={id} />}
          </>
        )}
      </div>
    </div>
  );
}
