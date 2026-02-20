import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Tribute } from '@/lib/types';
import { SignOutButton } from '@/components/SignOutButton';
import { TributeCard } from '@/components/TributeCard';

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth');

  const { data: tributes } = await supabase
    .from('tributes')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: contributing } = await supabase
    .from('contributors')
    .select('*, tribute:tributes(*)')
    .eq('user_id', user.id)
    .eq('status', 'active');

  const myTributes = (tributes || []) as Tribute[];
  const contributingTo = (contributing || []).map((c: any) => c.tribute).filter(Boolean) as Tribute[];

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-cream-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-earth-800 tracking-tight">
            Gathered<span className="text-amber-500">Light</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-earth-500">{userName}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-serif text-earth-800 mb-2">
            Welcome, {userName}
          </h1>
          <p className="text-earth-500">Your tributes and shared memories, all in one place.</p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-10">
          <Link href="/tributes/new" className="btn-primary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create a Tribute
          </Link>
          <Link href="/join" className="btn-secondary inline-flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
            Join with Code
          </Link>
        </div>

        {/* My Tributes */}
        <section className="mb-12">
          <h2 className="text-xl font-serif text-earth-800 mb-5">My Tributes</h2>
          {myTributes.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif text-earth-700 mb-2">No tributes yet</h3>
              <p className="text-earth-500 mb-6">Create your first tribute to honor someone special.</p>
              <Link href="/tributes/new" className="btn-primary">
                Create a Tribute
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myTributes.map((tribute) => (
                <TributeCard key={tribute.id} tribute={tribute} isOwner />
              ))}
            </div>
          )}
        </section>

        {/* Contributing To */}
        {contributingTo.length > 0 && (
          <section>
            <h2 className="text-xl font-serif text-earth-800 mb-5">Contributing To</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contributingTo.map((tribute) => (
                <TributeCard key={tribute.id} tribute={tribute} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
