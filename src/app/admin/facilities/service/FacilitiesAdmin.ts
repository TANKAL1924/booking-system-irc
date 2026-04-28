import { supabase } from '@/lib/supabase';

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
  slots: FacilitySlot[] | null;
  add_on: FacilityAddOn[] | null;
  pic_contact: string | null;
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
  // Collect all image URLs (pic_link + add-on images)
  const urls: string[] = [
    ...(facility.pic_link ?? []),
    ...(facility.add_on ?? []).map((a) => a.pic_add_on).filter(Boolean),
  ];

  // Extract storage paths (filename after the bucket name in the URL)
  const paths = urls
    .map((url) => {
      try {
        const parts = new URL(url).pathname.split('/facilities/');
        return parts.length > 1 ? parts[1] : null;
      } catch {
        return null;
      }
    })
    .filter((p): p is string => !!p);

  if (paths.length > 0) {
    await supabase.storage.from('facilities').remove(paths);
  }

  const { error } = await supabase.from('facilities').delete().eq('id', facility.id);
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
