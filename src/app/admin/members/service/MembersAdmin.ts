import { supabase } from '@/lib/supabase';

export interface Member {
  id: number;
  name: string;
  price: number;
  duration: string;
  whatsapp: string;
  description: string;
}

export type MemberPayload = Omit<Member, 'id'>;

// TODO: replace table/column names to match your Supabase schema
export async function fetchMembers(): Promise<Member[]> {
  const { data, error } = await supabase.from('member').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Member[];
}

export async function createMember(payload: MemberPayload): Promise<void> {
  const { error } = await supabase.from('member').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateMember(id: number, payload: MemberPayload): Promise<void> {
  const { error } = await supabase.from('member').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteMember(id: number): Promise<void> {
  const { error } = await supabase.from('member').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
