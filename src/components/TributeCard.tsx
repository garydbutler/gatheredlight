import Link from 'next/link';
import type { Tribute } from '@/lib/types';

function formatDate(dateStr: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function TributeCard({ tribute, isOwner }: { tribute: Tribute; isOwner?: boolean }) {
  const born = formatDate(tribute.born_date);
  const passed = formatDate(tribute.passed_date);
  const dateRange = born && passed ? `${born} - ${passed}` : born || passed || null;

  return (
    <Link href={`/tributes/${tribute.id}`} className="card group cursor-pointer">
      {/* Cover Photo */}
      <div className="h-40 bg-gradient-to-br from-amber-100 to-cream-200 relative overflow-hidden">
        {tribute.cover_photo_url ? (
          <img
            src={tribute.cover_photo_url}
            alt={tribute.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-12 h-12 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
            </svg>
          </div>
        )}
        {isOwner && (
          <span className="absolute top-3 right-3 badge-amber text-xs">Creator</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-serif text-earth-800 mb-1 group-hover:text-amber-600 transition-colors">
          {tribute.name}
        </h3>
        {dateRange && (
          <p className="text-sm text-earth-400 mb-2">{dateRange}</p>
        )}
        {tribute.bio && (
          <p className="text-sm text-earth-500 line-clamp-2 leading-relaxed">{tribute.bio}</p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className={`badge text-xs ${
            tribute.privacy === 'public' ? 'badge-sage' : 'badge-earth'
          }`}>
            {tribute.privacy}
          </span>
        </div>
      </div>
    </Link>
  );
}
