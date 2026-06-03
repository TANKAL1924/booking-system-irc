import { supabase } from '@/lib/supabase';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';

export interface FacilitySlot {
  start: string;
  end: string;
  hour: number;
  price: number;
}

export interface FacilityAddOn {
  name: string;
  price: number;
  hour_add_on: number;
  pic_add_on: string;
}

export interface Facility {
  id: number;
  name: string | null;
  status: boolean | null;
  pic_link: string[] | null;
  type: boolean | null;
  purpose: boolean | null;
  slots: FacilitySlot[] | null;
  add_on: FacilityAddOn[] | null;
  pic_contact: string | null;
  description: string[] | null;
  morning_fee: number | null;
  night_fee: number | null;
  off_day: string[] | null;
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

export async function deleteFacility(facility: Facility): Promise<void> {
  // Delete all images from R2
  const urls: string[] = [
    ...(facility.pic_link ?? []),
    ...(facility.add_on ?? []).map((a) => a.pic_add_on).filter(Boolean),
  ];
  await Promise.all(urls.map((url) => deleteFromR2(url).catch(() => {})));

  const { error } = await supabase.from('facilities').delete().eq('id', facility.id);
  if (error) throw new Error(error.message);
}

export async function uploadFacilityImage(file: File): Promise<string> {
  return uploadToR2(file, 'facilities');
}
