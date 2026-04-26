import { supabase } from '@/lib/supabase';

export interface Facility {
  id: number;
  name: string | null;
  price_per_hour: number | null;
  description: string | null;
  status: boolean | null;
  pic_link: string | null;
}

export type FacilityPayload = Omit<Facility, 'id'>;

export async function fetchFacilities(): Promise<Facility[]> {
  const { data, error } = await supabase.from('facilities').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Facility[];
}

export async function createFacility(payload: FacilityPayload): Promise<void> {
  const { error } = await supabase.from('facilities').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateFacility(id: number, payload: FacilityPayload): Promise<void> {
  const { error } = await supabase.from('facilities').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteFacility(id: number): Promise<void> {
  const { error } = await supabase.from('facilities').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function uploadFacilityImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from('facilities').upload(fileName, file, { upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('facilities').getPublicUrl(fileName);
  return data.publicUrl;
}
