'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks';
import { format } from 'date-fns';
import type { Memory } from '@/lib/types';

const REACTION_EMOJIS = ['heart', 'candle', 'flower'];
const EMOJI_MAP: Record<string, string> = { heart: '\u2764', candle: '\uD83D\uDD6F', flower: '\uD83C\uDF38' };

export default function MemoryDetailPage() {
  const { id: tributeId, memoryId } = useParams<{ id: string; memoryId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  const [memory, setMemory] = useState<Memory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('memories')
      .select('*, contributor:contributors(*), reactions(*)')
      .eq('id', memoryId)
      .single()
      .then(({ data }) => {
        setMemory(data);
        setLoading(false);
      });
  }, [memoryId]);

  async function toggleReaction(emoji: string) {
    if (!user || !memory) return;
    const existing = memory.reactions?.find((r) => r.user_id === user.id && r.emoji === emoji);
    if (existing) {
      await supabase.from('reactions').delete().eq('id', existing.id);
    } else {
      await supabase.from('reactions').insert({ memory_id: memoryId, user_id: user.id, emoji });
    }
    // Refresh
    const { data } = await supabase
      .from('memories')
      .select('*, contributor:contributors(*), reactions(*)')
      .eq('id', memoryId)
      .single();
    if (data) setMemory(data);
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="w-8 h-8 border-2 border-amber-300 border-t-amber-500 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="text-center py-32">
          <h1 className="text-2xl font-serif text-earth-700">Memory not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">
        <button
          onClick={() => router.push(`/tributes/${tributeId}`)}
          className="text-sm text-earth-400 hover:text-earth-600 mb-8 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to tribute
        </button>

        {/* Photo */}
        {memory.media_url && memory.type === 'photo' && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-md">
            <img src={memory.media_url} alt={memory.title || 'Memory'} className="w-full" />
          </div>
        )}

        {/* Title */}
        {memory.title && (
          <h1 className="text-3xl md:text-4xl font-serif text-earth-800 mb-4">{memory.title}</h1>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 mb-8 text-sm text-earth-400">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-sm font-serif text-amber-600">
                {(memory.contributor?.name || 'A')[0]}
              </span>
            </div>
            <span className="text-earth-600 font-medium">
              {memory.contributor?.name || 'Someone special'}
            </span>
          </div>
          {memory.contributor?.relationship && (
            <span className="badge-amber text-xs">{memory.contributor.relationship}</span>
          )}
          {memory.memory_date && (
            <span>{format(new Date(memory.memory_date), 'MMMM d, yyyy')}</span>
          )}
          {memory.location && <span>{memory.location}</span>}
        </div>

        {/* Content */}
        {memory.content && (
          <div className="prose max-w-none mb-10">
            <p className="text-earth-600 text-lg leading-relaxed whitespace-pre-line">{memory.content}</p>
          </div>
        )}

        {/* Reactions */}
        <div className="border-t border-cream-200 pt-6">
          <div className="flex items-center gap-3">
            {REACTION_EMOJIS.map((emoji) => {
              const count = memory.reactions?.filter((r) => r.emoji === emoji).length || 0;
              const mine = memory.reactions?.some((r) => r.emoji === emoji && r.user_id === user?.id);
              return (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(emoji)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition-all ${
                    mine
                      ? 'bg-amber-100 border-2 border-amber-300 text-amber-700'
                      : 'bg-cream-50 border-2 border-cream-200 text-earth-500 hover:border-amber-200'
                  }`}
                >
                  <span className="text-base">{EMOJI_MAP[emoji]}</span>
                  {count > 0 && <span>{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
