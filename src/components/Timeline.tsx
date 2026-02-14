'use client';

import Link from 'next/link';
import type { Memory } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  memories: Memory[];
  tributeId: string;
}

export default function Timeline({ memories, tributeId }: Props) {
  const sorted = [...memories]
    .filter((m) => m.memory_date)
    .sort((a, b) => new Date(a.memory_date!).getTime() - new Date(b.memory_date!).getTime());

  const undated = memories.filter((m) => !m.memory_date);

  return (
    <div className="max-w-3xl mx-auto pt-8">
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-cream-300" />

        {sorted.map((memory, i) => (
          <Link
            key={memory.id}
            href={`/tributes/${tributeId}/memories/${memory.id}`}
            className="relative flex gap-6 mb-8 group"
          >
            {/* Dot */}
            <div className="relative z-10 flex-shrink-0 w-12 flex items-start justify-center pt-1">
              <div className="w-3 h-3 rounded-full bg-amber-400 ring-4 ring-amber-100 group-hover:bg-amber-500 transition-colors" />
            </div>

            {/* Content */}
            <div className="card flex-1 p-5 -mt-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-amber-600">
                    {format(new Date(memory.memory_date!), 'MMMM d, yyyy')}
                  </span>
                  {memory.title && (
                    <h3 className="font-serif text-lg text-earth-800 mt-1 group-hover:text-amber-600 transition-colors">
                      {memory.title}
                    </h3>
                  )}
                </div>
                {memory.type === 'photo' && memory.media_url && (
                  <img
                    src={memory.media_url}
                    alt=""
                    className="w-16 h-16 object-cover rounded-lg ml-4 flex-shrink-0"
                  />
                )}
              </div>
              {memory.content && (
                <p className="text-sm text-earth-500 leading-relaxed line-clamp-3">
                  {memory.content}
                </p>
              )}
              <p className="text-xs text-earth-400 mt-3">
                {memory.contributor?.name}
                {memory.location && <span> &middot; {memory.location}</span>}
              </p>
            </div>
          </Link>
        ))}

        {undated.length > 0 && (
          <div className="relative flex gap-6 mb-8">
            <div className="relative z-10 flex-shrink-0 w-12 flex items-start justify-center pt-1">
              <div className="w-3 h-3 rounded-full bg-cream-300 ring-4 ring-cream-100" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-earth-400 mb-4 font-medium">Undated memories</p>
              <div className="space-y-3">
                {undated.map((memory) => (
                  <Link
                    key={memory.id}
                    href={`/tributes/${tributeId}/memories/${memory.id}`}
                    className="card block p-4 group"
                  >
                    {memory.title && (
                      <h3 className="font-serif text-earth-800 group-hover:text-amber-600 transition-colors">
                        {memory.title}
                      </h3>
                    )}
                    {memory.content && (
                      <p className="text-sm text-earth-500 line-clamp-2 mt-1">{memory.content}</p>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
