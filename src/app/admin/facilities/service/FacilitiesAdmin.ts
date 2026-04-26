import { supabase } from '@/lib/supabase';

export interface Facility {
  id: number;
  name: string;
  description: string;
  pricePerHour: number;
  category: string;
  enabled: boolean;
}

export type FacilityPayload = Omit<Facility, 'id'>;

// TODO: replace table/column names to match your Supabase schema
export async function fetchFacilities(): Promise<Facility[]> {
  const { data, error } = await supabase.from('facility').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Facility[];
}

export async function createFacility(payload: FacilityPayload): Promise<void> {
  const { error } = await supabase.from('facility').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateFacility(id: number, payload: FacilityPayload): Promise<void> {
  const { error } = await supabase.from('facility').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteFacility(id: number): Promise<void> {
  const { error } = await supabase.from('facility').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
