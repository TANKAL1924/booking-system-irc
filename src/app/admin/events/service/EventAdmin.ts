import { supabase } from '@/lib/supabase';

export interface Event {
  id: number;
  title: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  image: string;
  status: 'Published' | 'Draft';
}

export type EventPayload = Omit<Event, 'id'>;

// TODO: replace table/column names to match your Supabase schema
export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from('event').select('*').order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data as Event[];
}

export async function createEvent(payload: EventPayload): Promise<void> {
  const { error } = await supabase.from('event').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updateEvent(id: number, payload: EventPayload): Promise<void> {
  const { error } = await supabase.from('event').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteEvent(id: number): Promise<void> {
  const { error } = await supabase.from('event').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
