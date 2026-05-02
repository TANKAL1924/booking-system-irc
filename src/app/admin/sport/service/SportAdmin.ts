import { supabase } from '@/lib/supabase';

export interface Sport {
  id: number;
  sport: string;
  description: string[];
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

export async function updateSport(id: number, payload: Omit<Sport, 'id'>): Promise<void> {
  const { error } = await supabase.from('sport').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteSport(id: number): Promise<void> {
  const { error } = await supabase.from('sport').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
