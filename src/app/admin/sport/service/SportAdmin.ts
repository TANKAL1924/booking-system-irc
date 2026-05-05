import { supabase } from '@/lib/supabase';

export interface Sport {
  id: number;
  sport: string;
  description: string[];
  sport_pic: string | null;
}

export async function fetchSports(): Promise<Sport[]> {
  const { data, error } = await supabase.from('sport').select('*').order('id');
  if (error) throw new Error(error.message);
  return (data ?? []) as Sport[];
}

export async function createSport(payload: Omit<Sport, 'id'>): Promise<void> {
  const { error } = await supabase.from('sport').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateSport(id: number, payload: Partial<Omit<Sport, 'id'>>): Promise<void> {
  const { error } = await supabase.from('sport').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteSport(id: number): Promise<void> {
  const { error } = await supabase.from('sport').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadSportPic(file: File, sportId: number): Promise<string> {
  const ext = file.name.split('.').pop();
  const path = `${sportId}-${Date.now()}.${ext}`;
  const { error: uploadError } = await supabase.storage.from('sport').upload(path, file, { upsert: true });
  if (uploadError) throw new Error(uploadError.message);
  const { data } = supabase.storage.from('sport').getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteSportPic(url: string): Promise<void> {
  const path = url.split('/sport/')[1];
  if (!path) return;
  await supabase.storage.from('sport').remove([path]);
}
