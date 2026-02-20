'use client';

import Link from 'next/link';

export function AddMemoryButton({ tributeId, variant = 'secondary' }: { tributeId: string; variant?: 'primary' | 'secondary' }) {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary w-full';

  return (
    <Link href={`/tributes/${tributeId}/add-memory`} className={`${className} inline-flex items-center justify-center gap-2`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
      Share a Memory
    </Link>
  );
}
