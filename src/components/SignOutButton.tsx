'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <button onClick={handleSignOut} className="btn-ghost text-sm py-2 px-3">
      Sign out
    </button>
  );
}
