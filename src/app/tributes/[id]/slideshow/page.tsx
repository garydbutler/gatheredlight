'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTribute, useMemories } from '@/lib/hooks';
import type { Memory } from '@/lib/types';

const KB_CLASSES = ['kenburns-1', 'kenburns-2', 'kenburns-3'];

export default function SlideshowPage() {
  const { id } = useParams<{ id: string }>();
  const { tribute } = useTribute(id);
  const { memories } = useMemories(id);
  const router = useRouter();

  const photos = memories.filter((m) => m.media_url && m.type === 'photo');
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % Math.max(photos.length, 1));
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + photos.length) % Math.max(photos.length, 1));
  }, [photos.length]);

  useEffect(() => {
    if (!isPlaying || photos.length === 0) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [isPlaying, next, photos.length]);

  // Keyboard controls
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === ' ') { e.preventDefault(); setIsPlaying((p) => !p); }
      else if (e.key === 'Escape') router.push(`/tributes/${id}`);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [next, prev, router, id]);

  if (photos.length === 0) {
    return (
      <div className="min-h-screen bg-earth-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-cream-300 text-lg mb-4">No photos to show in the slideshow.</p>
          <button onClick={() => router.push(`/tributes/${id}`)} className="btn-primary">
            Back to Tribute
          </button>
        </div>
      </div>
    );
  }

  const photo = photos[current];

  return (
    <div className="fixed inset-0 bg-earth-900 z-50 flex items-center justify-center">
      {/* Photo */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          key={photo.id}
          src={photo.media_url!}
          alt={photo.title || ''}
          className={`w-full h-full object-cover animate-fade-in ${KB_CLASSES[current % 3]}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-earth-900/80 via-transparent to-earth-900/30" />
      </div>

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 animate-slide-up">
        {photo.title && (
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">{photo.title}</h2>
        )}
        {photo.content && (
          <p className="text-cream-200 text-lg max-w-2xl leading-relaxed">{photo.content}</p>
        )}
        <p className="text-cream-300/60 text-sm mt-4">
          {photo.contributor?.name}
          {photo.contributor?.relationship && ` -- ${photo.contributor.relationship}`}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <button
          onClick={() => router.push(`/tributes/${id}`)}
          className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {photos.slice(0, 20).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              i === current ? 'bg-amber-400 w-6' : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Tribute name */}
      <div className="absolute top-6 left-6">
        <p className="text-white/60 font-serif text-lg">
          {tribute?.name && `Remembering ${tribute.name}`}
        </p>
        <p className="text-white/30 text-sm mt-1">{current + 1} / {photos.length}</p>
      </div>
    </div>
  );
}
