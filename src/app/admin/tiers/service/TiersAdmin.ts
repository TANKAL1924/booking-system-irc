import { supabase } from '@/lib/supabase';

export interface Tier {
  id: number;
  name: string;
  description: string;
  price: number;
  list_details: string[];
  wa_number: string;
}

export type TierPayload = Omit<Tier, 'id'>;

export async function fetchTiers(): Promise<Tier[]> {
  const { data, error } = await supabase.from('tier').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Tier[];
}

export async function createTier(payload: TierPayload): Promise<void> {
  const { error } = await supabase.from('tier').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateTier(id: number, payload: TierPayload): Promise<void> {
  const { error } = await supabase.from('tier').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteTier(id: number): Promise<void> {
  const { error } = await supabase.from('tier').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
