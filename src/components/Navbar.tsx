'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <nav className="border-b border-cream-200 bg-warm-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3 max-w-6xl mx-auto">
        <Link href={user ? '/dashboard' : '/'} className="font-serif text-2xl text-earth-800 tracking-tight">
          Gathered<span className="text-amber-500">Light</span>
        </Link>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm py-2 px-4">My Tributes</Link>
              <Link href="/profile" className="btn-ghost text-sm py-2 px-4">Profile</Link>
              <button
                onClick={async () => { await supabase.auth.signOut(); router.push('/'); }}
                className="btn-ghost text-sm py-2 px-4 text-earth-400"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/join" className="btn-ghost text-sm py-2 px-4">Join</Link>
              <Link href="/auth" className="btn-primary text-sm py-2 px-4">Sign In</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
