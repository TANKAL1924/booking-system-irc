import { supabase } from '@/lib/supabase';
import { uploadToR2, deleteFromR2 } from '@/lib/r2Storage';

export interface Sport {
  id: number;
  sport: string;
  description: string[];
  sport_pic: string | null;
}

export interface SportTeam {
  id: number;
  name: string | null;
  phone: string | null;
  position: string | null;
  sport_id: number;
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

export async function uploadSportPic(file: File): Promise<string> {
  return uploadToR2(file, 'sport');
}

export async function deleteSportPic(url: string): Promise<void> {
  await deleteFromR2(url).catch(() => {});
}

export async function fetchTeamBySport(sportId: number): Promise<SportTeam[]> {
  const { data, error } = await supabase.from('sport_team').select('*').eq('sport_id', sportId).order('id');
  if (error) throw new Error(error.message);
  return (data ?? []) as SportTeam[];
}

export async function createTeamMember(payload: Omit<SportTeam, 'id'>): Promise<void> {
  const { error } = await supabase.from('sport_team').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateTeamMember(id: number, payload: Partial<Omit<SportTeam, 'id'>>): Promise<void> {
  const { error } = await supabase.from('sport_team').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteTeamMember(id: number): Promise<void> {
  const { error } = await supabase.from('sport_team').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
