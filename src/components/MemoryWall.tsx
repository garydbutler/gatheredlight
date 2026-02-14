'use client';

import Link from 'next/link';
import type { Memory } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  memories: Memory[];
  tributeId: string;
}

export default function MemoryWall({ memories, tributeId }: Props) {
  return (
    <div className="masonry pt-6">
      {memories.map((memory) => (
        <Link
          key={memory.id}
          href={`/tributes/${tributeId}/memories/${memory.id}`}
          className="card block group"
        >
          {memory.media_url && memory.type === 'photo' && (
            <div className="overflow-hidden">
              <img
                src={memory.media_url}
                alt={memory.title || 'Memory'}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          )}
          <div className="p-4">
            {memory.title && (
              <h3 className="font-serif text-lg text-earth-800 mb-1 group-hover:text-amber-600 transition-colors">
                {memory.title}
              </h3>
            )}
            {memory.content && (
              <p className="text-sm text-earth-500 line-clamp-4 leading-relaxed">
                {memory.content}
              </p>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-cream-100">
              <span className="text-xs text-earth-400">
                {memory.contributor?.name || 'Someone special'}
                {memory.contributor?.relationship && (
                  <span className="text-earth-300"> &middot; {memory.contributor.relationship}</span>
                )}
              </span>
              {memory.memory_date && (
                <span className="text-xs text-earth-300">
                  {format(new Date(memory.memory_date), 'MMM yyyy')}
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
