import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface BaseData {
  about_us: string | null;
  vision: string | null;
  mission: string | null;
  tiktok: string | null;
  insta: string | null;
  facebook: string | null;
  layout: string | null;
  main_vid: string | null;
  location: string | null;
  address: string | null;
  whatsapp: string | null;
  email: string | null;
  tnc: string[] | null;
  lat: number | null;
  long: number | null;
}

interface BaseState {
  base: BaseData | null;
  loading: boolean;
  fetch: () => Promise<void>;
}

export const useBaseStore = create<BaseState>()((set, get) => ({
  base: null,
  loading: false,
  fetch: async () => {
    if (get().base !== null) return;
    set({ loading: true });
    const { data } = await supabase.from('base').select('*').eq('id', 1).single();
    set({ base: data ?? null, loading: false });
  },
}));
