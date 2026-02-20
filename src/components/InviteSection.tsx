'use client';

import { useState } from 'react';

export function InviteSection({ inviteCode }: { inviteCode: string }) {
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = inviteCode;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  async function copyLink() {
    const link = `${window.location.origin}/join?code=${inviteCode}`;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  return (
    <div className="card p-5">
      <h3 className="text-sm font-medium text-earth-700 mb-3">Invite Contributors</h3>
      <p className="text-xs text-earth-500 mb-3">Share this code so others can add their memories.</p>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 bg-cream-50 border border-cream-200 rounded-lg px-4 py-2.5 font-mono text-lg text-earth-800 text-center tracking-widest">
          {inviteCode}
        </div>
        <button
          onClick={copyCode}
          className="p-2.5 bg-cream-100 hover:bg-cream-200 rounded-lg transition-colors"
          title="Copy code"
        >
          {copied ? (
            <svg className="w-5 h-5 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-earth-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
            </svg>
          )}
        </button>
      </div>

      <button onClick={copyLink} className="text-xs text-amber-600 hover:underline">
        Copy invite link instead
      </button>
    </div>
  );
}
