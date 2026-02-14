'use client';

import Link from 'next/link';
import type { Memory } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  memories: Memory[];
  tributeId: string;
}

export default function StoriesView({ memories, tributeId }: Props) {
  const stories = memories.filter((m) => m.type === 'story' || (m.content && m.content.length > 100));

  if (stories.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-earth-400">No stories shared yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-6 space-y-8">
      {stories.map((memory) => (
        <Link
          key={memory.id}
          href={`/tributes/${tributeId}/memories/${memory.id}`}
          className="card block p-8 group"
        >
          {memory.title && (
            <h2 className="text-2xl font-serif text-earth-800 mb-4 group-hover:text-amber-600 transition-colors">
              {memory.title}
            </h2>
          )}
          <div className="prose prose-earth max-w-none">
            <p className="text-earth-600 leading-relaxed whitespace-pre-line">
              {memory.content}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-cream-100">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-sm font-serif text-amber-600">
                {(memory.contributor?.name || 'A')[0]}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-earth-700">
                {memory.contributor?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-earth-400">
                {memory.contributor?.relationship}
                {memory.memory_date && (
                  <span> &middot; {format(new Date(memory.memory_date), 'MMMM yyyy')}</span>
                )}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
