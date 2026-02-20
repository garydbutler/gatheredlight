import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import type { Tribute, Memory, Contributor } from '@/lib/types';
import { MemoryWall } from '@/components/MemoryWall';
import { AddMemoryButton } from '@/components/AddMemoryButton';
import { InviteSection } from '@/components/InviteSection';
import { CoverPhotoUpload } from '@/components/CoverPhotoUpload';

export default async function TributeDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  const { data: tribute } = await supabase
    .from('tributes')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!tribute) notFound();

  const { data: memories } = await supabase
    .from('memories')
    .select('*, contributor:contributors(name, relationship)')
    .eq('tribute_id', params.id)
    .order('created_at', { ascending: false });

  const { data: contributors } = await supabase
    .from('contributors')
    .select('*')
    .eq('tribute_id', params.id)
    .order('created_at', { ascending: true });

  const isOwner = tribute.creator_id === user.id;
  const typedTribute = tribute as Tribute;
  const typedMemories = (memories || []) as (Memory & { contributor: { name: string; relationship: string | null } | null })[];
  const typedContributors = (contributors || []) as Contributor[];

  const born = typedTribute.born_date
    ? new Date(typedTribute.born_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const passed = typedTribute.passed_date
    ? new Date(typedTribute.passed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  const memoryCount = typedMemories.length;
  const storyCount = typedMemories.filter(m => m.type === 'story').length;
  const photoCount = typedMemories.filter(m => m.type === 'photo').length;

  return (
    <div className="min-h-screen">
      {/* Cover Photo */}
      <div className="relative h-64 md:h-80 bg-gradient-to-br from-amber-100 via-cream-200 to-earth-100 overflow-hidden">
        {typedTribute.cover_photo_url ? (
          <img
            src={typedTribute.cover_photo_url}
            alt={typedTribute.name}
            className="w-full h-full object-cover kenburns-1"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <svg className="w-16 h-16 text-amber-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              {isOwner && <CoverPhotoUpload tributeId={params.id} />}
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-6xl mx-auto">
            <Link href="/dashboard" className="inline-flex items-center gap-1 text-white/80 text-sm hover:text-white mb-3 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Dashboard
            </Link>
            <h1 className="text-3xl md:text-5xl font-serif text-white mb-2">{typedTribute.name}</h1>
            {(born || passed) && (
              <p className="text-white/80 text-lg">
                {born && passed ? `${born} -- ${passed}` : born || passed}
              </p>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Bio + Stats */}
        <div className="grid lg:grid-cols-3 gap-8 mb-10">
          <div className="lg:col-span-2">
            {typedTribute.bio && (
              <div className="card p-6 mb-6">
                <p className="text-earth-600 leading-relaxed italic font-serif text-lg">
                  &ldquo;{typedTribute.bio}&rdquo;
                </p>
              </div>
            )}

            {/* Memory stats */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-earth-500">
                <span className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 font-semibold">{memoryCount}</span>
                memories
              </div>
              <div className="flex items-center gap-2 text-sm text-earth-500">
                <span className="w-8 h-8 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600 font-semibold">{storyCount}</span>
                stories
              </div>
              <div className="flex items-center gap-2 text-sm text-earth-500">
                <span className="w-8 h-8 bg-cream-200 rounded-lg flex items-center justify-center text-earth-600 font-semibold">{photoCount}</span>
                photos
              </div>
              <div className="flex items-center gap-2 text-sm text-earth-500">
                <span className="w-8 h-8 bg-earth-100 rounded-lg flex items-center justify-center text-earth-600 font-semibold">{typedContributors.filter(c => c.status === 'active').length}</span>
                contributors
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <AddMemoryButton tributeId={params.id} />
            {isOwner && <InviteSection inviteCode={typedTribute.invite_code} />}
          </div>
        </div>

        {/* Memory Wall */}
        <section>
          <h2 className="text-2xl font-serif text-earth-800 mb-6">Memory Wall</h2>
          {typedMemories.length === 0 ? (
            <div className="card p-16 text-center">
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-earth-700 mb-2">No memories shared yet</h3>
              <p className="text-earth-500 mb-6">Be the first to share a memory of {typedTribute.name}.</p>
              <AddMemoryButton tributeId={params.id} variant="primary" />
            </div>
          ) : (
            <MemoryWall memories={typedMemories} />
          )}
        </section>
      </main>
    </div>
  );
}
