'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useTribute, useContributors } from '@/lib/hooks';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/hooks';

export default function InvitePage() {
  const { id } = useParams<{ id: string }>();
  const { tribute } = useTribute(id);
  const { contributors } = useContributors(id);
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [sending, setSending] = useState(false);

  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/join?code=${tribute?.invite_code}`
    : '';

  function copyLink() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function sendInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !tribute) return;
    setSending(true);
    await supabase.from('contributors').insert({
      tribute_id: id,
      name,
      email,
      relationship,
      invited_by: user.id,
      status: 'invited',
    });
    setEmail('');
    setName('');
    setRelationship('');
    setSending(false);
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-serif text-earth-800 mb-2">Invite Contributors</h1>
        <p className="text-earth-400 mb-10">
          Share the invitation so others can add their memories of {tribute?.name}.
        </p>

        {/* Invite Link */}
        <div className="card p-6 mb-8">
          <h2 className="font-serif text-lg text-earth-700 mb-3">Share Invite Link</h2>
          <div className="flex gap-2">
            <input type="text" readOnly value={inviteUrl} className="input flex-1 text-sm bg-cream-100" />
            <button onClick={copyLink} className="btn-primary whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-earth-400">Invite Code:</span>
            <code className="bg-cream-100 px-3 py-1 rounded-lg text-amber-600 font-mono text-sm">
              {tribute?.invite_code}
            </code>
          </div>
        </div>

        {/* Add by Email */}
        <div className="card p-6 mb-8">
          <h2 className="font-serif text-lg text-earth-700 mb-4">Add Someone Directly</h2>
          <form onSubmit={sendInvite} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Their name"
                required
              />
              <input
                type="text"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="input"
                placeholder="Relationship (e.g., Sister)"
              />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Email address"
            />
            <button type="submit" disabled={sending} className="btn-primary">
              {sending ? 'Adding...' : 'Add Contributor'}
            </button>
          </form>
        </div>

        {/* Contributors List */}
        {contributors.length > 0 && (
          <div className="card p-6">
            <h2 className="font-serif text-lg text-earth-700 mb-4">Contributors ({contributors.length})</h2>
            <div className="space-y-3">
              {contributors.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <span className="font-serif text-amber-600">{c.name[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-earth-700">{c.name}</p>
                      {c.relationship && <p className="text-xs text-earth-400">{c.relationship}</p>}
                    </div>
                  </div>
                  <span className={`badge text-xs ${
                    c.status === 'active' ? 'badge-sage' : 'badge-earth'
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
