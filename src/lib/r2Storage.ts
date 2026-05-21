import { supabase } from '@/lib/supabase';

/**
 * Upload a file to Supabase Storage.
 * @param file   - The file to upload.
 * @param folder - The storage bucket name (e.g. 'gallery', 'events', 'sport').
 * @returns The public URL of the uploaded file.
 */
export async function uploadToR2(file: File, folder: string): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(folder).upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from(folder).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage by its public URL.
 * Expects URL format: .../storage/v1/object/public/<bucket>/<path>
 */
export async function deleteFromR2(url: string): Promise<void> {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split('/object/public/');
    if (parts.length < 2) return;
    const [bucket, ...pathParts] = parts[1].split('/');
    const filePath = pathParts.join('/');
    await supabase.storage.from(bucket).remove([filePath]);
  } catch {
    // ignore deletion errors
  }
}
