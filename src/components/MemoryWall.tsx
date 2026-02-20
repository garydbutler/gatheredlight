'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Memory } from '@/lib/types';

type MemoryWithContributor = Memory & {
  contributor: { name: string; relationship: string | null } | null;
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function MemoryCard({ memory, index }: { memory: MemoryWithContributor; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="card overflow-hidden break-inside-avoid mb-4"
    >
      {/* Photo */}
      {memory.type === 'photo' && memory.media_url && (
        <div className="relative overflow-hidden">
          <img
            src={memory.media_url}
            alt={memory.title || 'Memory photo'}
            className="w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-5">
        {/* Type badge */}
        <div className="flex items-center gap-2 mb-3">
          {memory.type === 'story' && (
            <span className="badge-sage text-xs">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              Story
            </span>
          )}
          {memory.type === 'photo' && (
            <span className="badge-amber text-xs">Photo</span>
          )}
          {memory.is_featured && (
            <span className="badge-amber text-xs">Featured</span>
          )}
        </div>

        {/* Title */}
        {memory.title && (
          <h3 className="font-serif text-lg text-earth-800 mb-2">{memory.title}</h3>
        )}

        {/* Content */}
        {memory.content && (
          <div className="text-earth-600 leading-relaxed text-sm">
            {memory.content.length > 300 && !expanded ? (
              <>
                <p>{memory.content.slice(0, 300)}...</p>
                <button
                  onClick={() => setExpanded(true)}
                  className="text-amber-600 font-medium hover:underline mt-1"
                >
                  Read more
                </button>
              </>
            ) : (
              <p className="whitespace-pre-wrap">{memory.content}</p>
            )}
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-cream-100">
          <div className="text-xs text-earth-400">
            {memory.contributor && (
              <span>
                {memory.contributor.name}
                {memory.contributor.relationship && (
                  <span className="text-earth-300"> &middot; {memory.contributor.relationship}</span>
                )}
              </span>
            )}
          </div>
          <div className="text-xs text-earth-400">
            {memory.memory_date ? formatDate(memory.memory_date) : formatDate(memory.created_at)}
          </div>
        </div>

        {/* Location */}
        {memory.location && (
          <div className="flex items-center gap-1 mt-2 text-xs text-earth-400">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {memory.location}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function MemoryWall({ memories }: { memories: MemoryWithContributor[] }) {
  const [filter, setFilter] = useState<'all' | 'story' | 'photo'>('all');

  const filtered = filter === 'all' ? memories : memories.filter(m => m.type === filter);

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'story', 'photo'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-amber-500 text-white'
                : 'bg-cream-100 text-earth-600 hover:bg-cream-200'
            }`}
          >
            {f === 'all' ? 'All' : f === 'story' ? 'Stories' : 'Photos'}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="masonry">
        <AnimatePresence>
          {filtered.map((memory, i) => (
            <MemoryCard key={memory.id} memory={memory} index={i} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
