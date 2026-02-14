import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import type { Tribute, Memory, Contributor } from './types';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

export function useTributes(userId?: string) {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('tributes')
      .select('*')
      .eq('creator_id', userId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTributes(data || []);
        setLoading(false);
      });
  }, [userId]);

  return { tributes, loading };
}

export function useTribute(id: string) {
  const [tribute, setTribute] = useState<Tribute | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('tributes')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setTribute(data);
        setLoading(false);
      });
  }, [id]);

  return { tribute, loading };
}

export function useMemories(tributeId: string) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('memories')
      .select('*, contributor:contributors(*)')
      .eq('tribute_id', tributeId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setMemories(data || []);
        setLoading(false);
      });
  }, [tributeId]);

  return { memories, loading, setMemories };
}

export function useContributors(tributeId: string) {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('contributors')
      .select('*')
      .eq('tribute_id', tributeId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setContributors(data || []);
        setLoading(false);
      });
  }, [tributeId]);

  return { contributors, loading };
}
