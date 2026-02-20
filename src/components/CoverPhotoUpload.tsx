'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function CoverPhotoUpload({ tributeId }: { tributeId: string }) {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `covers/${tributeId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('tribute-media')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('tribute-media')
        .getPublicUrl(path);

      await supabase
        .from('tributes')
        .update({ cover_photo_url: publicUrl })
        .eq('id', tributeId);

      router.refresh();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  }

  return (
    <label className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm cursor-pointer transition-colors">
      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
      {uploading ? 'Uploading...' : 'Add cover photo'}
    </label>
  );
}
