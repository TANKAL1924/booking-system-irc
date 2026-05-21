import { supabase } from '@/lib/supabase';

export interface Promo {
  id: number;
  promo_code: string;
  promo_price: number;
  used: boolean;
  created_at: string;
}

export type PromoPayload = Pick<Promo, 'promo_code' | 'promo_price'>;

export async function fetchPromos(): Promise<Promo[]> {
  const { data, error } = await supabase.from('promo').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Promo[];
}

export async function createPromo(payload: PromoPayload): Promise<void> {
  const { error } = await supabase.from('promo').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updatePromo(id: number, payload: PromoPayload): Promise<void> {
  const { error } = await supabase.from('promo').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePromo(id: number): Promise<void> {
  const { error } = await supabase.from('promo').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function markPromoUsed(code: string): Promise<void> {
  const { error } = await supabase.from('promo').update({ used: false }).eq('promo_code', code);
  if (error) throw new Error(error.message);
}

export async function resetPromo(id: number): Promise<void> {
  const { error } = await supabase.from('promo').update({ used: true }).eq('id', id);
  if (error) throw new Error(error.message);
}
