import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadMedia(file: File, tributeId: string): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const path = `${tributeId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('tribute-media').upload(path, file);
  if (error) {
    console.error('Upload error:', error);
    return null;
  }
  const { data } = supabase.storage.from('tribute-media').getPublicUrl(path);
  return data.publicUrl;
}
